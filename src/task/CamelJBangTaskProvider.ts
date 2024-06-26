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
import { CancellationToken, ProviderResult, ShellExecution, ShellExecutionOptions, ShellQuoting, Task, TaskDefinition, TaskProvider, TaskRevealKind, TaskScope, workspace } from 'vscode';

export class CamelJBangTaskProvider implements TaskProvider {

	public static labelProvidedTask: string = "Start Camel application with debug enabled with JBang";
	public static labelProvidedRunTask: string = "Run Camel application with JBang";

	provideTasks(_token: CancellationToken): ProviderResult<Task[]> {
		const tasks: Task[] = [];
		const taskDefinition: TaskDefinition = {
			"label": CamelJBangTaskProvider.labelProvidedTask,
			"type": "shell"
		};

		const shellExecOptions: ShellExecutionOptions = {
			// see https://issues.apache.org/jira/browse/CAMEL-20431
			env: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'CAMEL_DEBUGGER_SUSPEND': 'true'
			}
		};

		const task = new Task(
			taskDefinition,
			TaskScope.Workspace,
			CamelJBangTaskProvider.labelProvidedTask,
			'camel',
			new ShellExecution(
				'jbang',
				[
					{
						"value": `-Dcamel.jbang.version=${this.getCamelJBangCLIVersion()}`,
						"quoting": ShellQuoting.Strong
					},
					{
						"value": '-Dorg.apache.camel.debugger.suspend=true',
						"quoting": ShellQuoting.Strong
					},
					'camel@apache/camel',
					'run',
					'${relativeFile}',
					'--dev',
					'--logging-level=info',
					{
						"value": '--dep=org.apache.camel:camel-debug',
						"quoting": ShellQuoting.Strong
					},
					this.getCamelVersion(),
					this.getRedHatMavenRepository(),
					...this.getExtraLaunchParameter()
				].filter(function (arg) { return arg; }), // remove ALL empty values ("", null, undefined and 0)
				shellExecOptions
			),
			'$camel.debug.problemMatcher'
		);
		task.isBackground = true;
		task.presentationOptions.reveal = TaskRevealKind.Always;

		const runTask = new Task(
			{
				"label": CamelJBangTaskProvider.labelProvidedRunTask,
				"type": "shell"
			},
			TaskScope.Workspace,
			CamelJBangTaskProvider.labelProvidedRunTask,
			'camel',
			new ShellExecution(
				'jbang',
				[
					{
						"value": `-Dcamel.jbang.version=${this.getCamelJBangCLIVersion()}`,
						"quoting": ShellQuoting.Strong
					},
					'camel@apache/camel',
					'run',
					'${relativeFile}',
					'--dev',
					'--logging-level=info',
					this.getCamelVersion(),
					this.getRedHatMavenRepository(),
					...this.getExtraLaunchParameter()
				].filter(function (arg) { return arg; }) // remove ALL empty values ("", null, undefined and 0)
			)
		);
		runTask.isBackground = true;

		tasks.push(task);
		tasks.push(runTask);
		return tasks;
	}

	resolveTask(_task: Task, _token: CancellationToken): ProviderResult<Task> {
		return undefined;
	}

	private getCamelJBangCLIVersion(): string {
		return workspace.getConfiguration().get('camel.debugAdapter.JBangVersion') as string;
	}

	private getCamelVersion(): string {
		const camelVersion = workspace.getConfiguration().get('camel.debugAdapter.CamelVersion') as string;
		if (camelVersion) {
			return `--camel-version=${camelVersion}`;
		} else {
			return '';
		}
	}

	private getCamelGlobalRepos(): string {
		const globalRepos = workspace.getConfiguration().get('camel.debugAdapter.redHatMavenRepository.global') as boolean;
		if (globalRepos) {
			return '#repos,';
		} else {
			return '';
		}
	}

	private getRedHatMavenRepository(): string {
		if (this.getCamelVersion().includes('redhat')) {
			const url = workspace.getConfiguration().get('camel.debugAdapter.RedHatMavenRepository') as string;
			const reposPlaceholder = this.getCamelGlobalRepos();
			return url ? `--repos=${reposPlaceholder}${url}` : '';
		} else {
			return '';
		}
	}

	private getExtraLaunchParameter(): string[] {
		const extraLaunchParameter = workspace.getConfiguration().get('camel.debugAdapter.ExtraLaunchParameter') as string[];
		if (extraLaunchParameter) {
			return extraLaunchParameter;
		} else {
			return [];
		}
	}
}
