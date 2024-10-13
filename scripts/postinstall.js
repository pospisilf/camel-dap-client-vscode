'use strict';

const dapServerVersion = '1.4.0-SNAPSHOT';

import pkg from "mvn-artifact-download"; // Default import
const { default: download } = pkg; // Destructure the download function
import * as fs from 'fs';
import * as path from 'path';

const MAVEN_REPO_URL = 'https://oss.sonatype.org/content/repositories/snapshots/';

download('com.github.camel-tooling:camel-dap-server:' + dapServerVersion, './jars/', MAVEN_REPO_URL).then((filename)=>{
	fs.renameSync(filename, path.join('.', 'jars', 'camel-dap-server.jar'));
});

download('com.github.camel-tooling:camel-dap-server:json:cyclonedx:' + dapServerVersion, '.', MAVEN_REPO_URL).then((filename)=>{
	fs.renameSync(filename, path.join('.', 'camel-dap-sbom.json'));
});
