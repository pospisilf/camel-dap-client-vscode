/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License", destination); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { expect } from 'chai';
import * as path from 'path';
import {
    ActivityBar,
    BottomBarPanel,
    DefaultWait,
    EditorActionDropdown,
    EditorView,
    SideBarView,
    VSBrowser,
    WebDriver,
} from 'vscode-uitests-tooling';
import {
    CAMEL_ROUTE_YAML_WITH_SPACE,
    CAMEL_RUN_ACTION_LABEL,
    CAMEL_RUN_DEBUG_ACTION_LABEL,
    waitUntilTerminalHasText,
    killTerminal,
    disconnectDebugger,
    TEST_ARRAY_RUN,
    isCamelVersionProductized,
    executeCommand
} from '../utils';
import { CAMEL_RUN_DEBUG_FOLDER_ACTION_LABEL, CAMEL_RUN_DEBUG_WORKSPACE_ACTION_LABEL, CAMEL_RUN_FOLDER_ACTION_LABEL, CAMEL_RUN_WORKSPACE_ACTION_LABEL } from '../variables';

describe('Camel file editor test', function () {

    describe('Camel Actions', function () {
        this.timeout(300000);

        let driver: WebDriver;
        let editorView: EditorView;

        beforeEach(async function () {
            driver = VSBrowser.instance.driver;
            await VSBrowser.instance.openResources(path.resolve('src', 'ui-test', 'resources', 'actions'));

            await (await new ActivityBar().getViewControl('Explorer')).openView();

            const section = await new SideBarView().getContent().getSection('actions');
            await section.openItem('top', 'top-route1.camel.yaml');

            editorView = new EditorView();
            await driver.wait(async function () {
                return (await editorView.getOpenEditorTitles()).find(title => title === 'top-route1.camel.yaml');
            }, 5000);
        });

        afterEach(async function () {
            await editorView.closeAllEditors();
            await new BottomBarPanel().toggle(false);
        });

        // it('Run actions are available', async function () {
        //     if (process.platform === "darwin"){
        //         this.skip();
        //     }
        //     await driver.sleep(500);
        //     const action = (await editorView.getAction("Run or Debug...")) as EditorActionDropdown;
        //     const menu = await action.open();
        //     expect(await menu.hasItem(CAMEL_RUN_ACTION_LABEL)).true;
        //     expect(await menu.hasItem(CAMEL_RUN_WORKSPACE_ACTION_LABEL)).true;
        //     expect(await menu.hasItem(CAMEL_RUN_FOLDER_ACTION_LABEL)).true;
        //     await menu.close();
        // });

        // it('Debug and Run actions are available', async function () {
        //     if (process.platform === "darwin"){
        //         this.skip();
        //     }
        //     await driver.sleep(500);
        //     const action = (await editorView.getAction("Run or Debug...")) as EditorActionDropdown;
        //     const menu = await action.open();
        //     expect(await menu.hasItem(CAMEL_RUN_DEBUG_ACTION_LABEL)).true;
        //     expect(await menu.hasItem(CAMEL_RUN_DEBUG_WORKSPACE_ACTION_LABEL)).true;
        //     expect(await menu.hasItem(CAMEL_RUN_DEBUG_FOLDER_ACTION_LABEL)).true;
        //     await menu.close();
        // });

        // const runActionLabels = [
        //     { label: CAMEL_RUN_ACTION_LABEL},
        //     { label: CAMEL_RUN_WORKSPACE_ACTION_LABEL},
        //     { label: CAMEL_RUN_FOLDER_ACTION_LABEL}
        // ];

        it(`simple case`, async function () {
            await executeCommand('Camel: Run with JBang Opened Camel Integration');
            await waitUntilTerminalHasText(driver, ['Hello Camel from top-route1'], 2000, 120000);
            await killTerminal();
        });


        it(`Camel: Run with JBang All Camel Integrations from containing folder`, async function () {
            await executeCommand('Camel: Run with JBang All Camel Integrations from containing folder');
            await waitUntilTerminalHasText(driver, ['Hello Camel from top-route1', 'Hello Camel from top-route2'], 2000, 60000);
            await killTerminal();
        });

        it(`Camel: Run with JBang All Camel Integrations from workspace root`, async function () {
            await executeCommand('Camel: Run with JBang All Camel Integrations from workspace root');
            await waitUntilTerminalHasText(driver, ['Hello Camel from route1', 'Hello Camel from route2'], 2000, 60000);
            await killTerminal();   
        });

        //Run with JBang and Debug Opened Camel Integration
      
        it(`Run with JBang and Debug Opened Camel Integration`, async function () {
           
            await executeCommand('Camel: Run with JBang and Debug Opened Camel Integration');

            await waitUntilTerminalHasText(driver, ['Hello Camel from top-route1'], 2000, 120000);

            await (await new ActivityBar().getViewControl('Run and Debug')).closeView();
            await disconnectDebugger(driver);
            await killTerminal();
        });

        //Run with JBang and Debug All Camel Integrations from workspace root
        it(`Run with JBang and Debug All Camel Integrations from workspace root`, async function () {

            await executeCommand('Camel: Run with JBang and Debug All Camel Integrations from workspace root');
            await waitUntilTerminalHasText(driver, ['Hello Camel from route1', 'Hello Camel from route2'], 2000, 60000);
            await (await new ActivityBar().getViewControl('Run and Debug')).closeView();
            await disconnectDebugger(driver);
            await killTerminal();
        });

        Run with JBang and Debug All Camel Integrations from containing folder
        it(`Run with JBang and Debug All Camel Integrations from containing folder`, async function () {
            await executeCommand('Camel: Run with JBang and Debug All Camel Integrations from containing folder');
            await waitUntilTerminalHasText(driver, ['Hello Camel from top-route1', 'Hello Camel from top-route2'], 2000, 60000);
            await (await new ActivityBar().getViewControl('Run and Debug')).closeView();
            await disconnectDebugger(driver);
            await killTerminal();
        });
        

    });
});
