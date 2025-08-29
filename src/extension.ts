import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getRepoUrl } from "./repo";
import { getInfrastructureTools } from "./infra";
import { getFolderStructure } from "./structure";
import { isNodeProject, isPythonProject, isJavaProject } from "./detectors";
import { getProdDependencies, getDevDependencies, getScripts, getPackageField } from "./jsproyect";
import { buildReadme } from "./readmeBuilder";
import { getMavenInfo, getGradleInfo } from "./javaproyect";
import { getLanguagesVersions } from "./languajeVersion";


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("readme-generator.createReadme", async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage("No workspace open");
			return;
		}

		const rootPath = workspaceFolders[0].uri.fsPath;

		//  Repository
		const repo = await getRepoUrl(rootPath);

		// language version


		// Infraestructure
		const infraTools = getInfrastructureTools(rootPath);

		//  Estructura del proyecto
		const structure = getFolderStructure(rootPath);

		//  Defaults
		let techs: string[] = [];
		let devDep: string[] = [];
		let scripts: string[] = [];
		let version = "unknown-version";
		let license = "unknown-license";
		let languageV: any = "";

		// --------------------
		// Detectores
		// --------------------
		if (isNodeProject(rootPath)) {
			languageV = await getLanguagesVersions(rootPath,
				[
					{ language: "nodejs", command: "node -v" },
					{ language: "npm", command: "npm -v" },
					{ language: "git", command: "git --version" },
				]

			);
			techs = getProdDependencies(rootPath);
			devDep = getDevDependencies(rootPath);
			scripts = getScripts(rootPath);
			version = getPackageField(rootPath, "version");
			license = getPackageField(rootPath, "license");
		} else if (isPythonProject(rootPath)) {
			techs = ["Python"];
		} else if (isJavaProject(rootPath)) {
			if (fs.existsSync(path.join(rootPath, "pom.xml"))) {
				const { version: mavenVersion, deps } = await getMavenInfo(rootPath);
				techs = ["Java (Maven)", ...deps];
				languageV = await getLanguagesVersions(rootPath,
					[
						{ language: "java", command: "java --version" },
						{ language: "javac", command: "javac -version" },
						{ language: "JAVA_HOME", command: "echo $JAVA_HOME" }
					]
				)

				version = mavenVersion;
			} else {
				const { version: gradleVersion, deps, scripts: gradleScripts } = getGradleInfo(rootPath);
				techs = ["Java (Gradle)", ...deps];
				languageV = await getLanguagesVersions(rootPath,
					[
						{ language: "java", command: "java --version" },
						{ language: "javac", command: "javac -version" },
						{ language: "JAVA_HOME", command: "echo $JAVA_HOME" }
					]
				)
				version = gradleVersion;
				scripts = gradleScripts;
			}
		}

		//  Build README
		const readmeContent = buildReadme({
			rootPath,
			languageV,
			repo,
			version,
			license,
			techs,
			devDep,
			scripts,
			infraTools,
			structure,
		});

		// Save README
		const readmePath = path.join(rootPath, "README.md");
		fs.writeFileSync(readmePath, readmeContent);

		vscode.window.showInformationMessage("README.md generado con éxito 🚀");
	});

	context.subscriptions.push(disposable);
}
