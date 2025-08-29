"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const repo_1 = require("./repo");
const infra_1 = require("./infra");
const structure_1 = require("./structure");
const detectors_1 = require("./detectors");
const jsproyect_1 = require("./jsproyect");
const readmeBuilder_1 = require("./readmeBuilder");
const javaproyect_1 = require("./javaproyect");
const languajeVersion_1 = require("./languajeVersion");
const readEnv_1 = require("./readEnv");
const pythonproyect_1 = require("./pythonproyect");
function activate(context) {
    let disposable = vscode.commands.registerCommand("readme-generator.createReadme", async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace open");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        //  Repository
        const repo = await (0, repo_1.getRepoUrl)(rootPath);
        // language version
        // Infraestructure
        const infraTools = (0, infra_1.getInfrastructureTools)(rootPath);
        //  Estructura del proyecto
        const structure = (0, structure_1.getFolderStructure)(rootPath);
        //  Defaults
        let techs = [];
        let devDep = [];
        let scripts = [];
        let version = "unknown-version";
        let license = "unknown-license";
        let languageV = "";
        let env = [];
        // --------------------
        // Detectores
        // --------------------
        if ((0, detectors_1.isNodeProject)(rootPath)) {
            languageV = await (0, languajeVersion_1.getLanguagesVersions)(rootPath, [
                { language: "nodejs", command: "node -v" },
                { language: "npm", command: "npm -v" },
                { language: "git", command: "git --version" },
            ]);
            techs = (0, jsproyect_1.getProdDependencies)(rootPath);
            devDep = (0, jsproyect_1.getDevDependencies)(rootPath);
            scripts = (0, jsproyect_1.getScripts)(rootPath);
            version = (0, jsproyect_1.getPackageField)(rootPath, "version");
            license = (0, jsproyect_1.getPackageField)(rootPath, "license");
            env = (0, readEnv_1.readEnvVariable)(rootPath);
        }
        else if ((0, detectors_1.isPythonProject)(rootPath)) {
            techs = (0, pythonproyect_1.getTechPython)(rootPath);
            languageV = await (0, languajeVersion_1.getLanguagesVersions)(rootPath, [
                { language: "git", command: "git --version" },
                { language: "python", command: "python --version" },
                { language: "python3", command: "python3 --version" },
                { language: "pip", command: "pip --version" },
                { language: "pip3", command: "pip3 --version" }
            ]);
            env = (0, readEnv_1.readEnvVariable)(rootPath);
        }
        else if ((0, detectors_1.isJavaProject)(rootPath)) {
            if (fs.existsSync(path.join(rootPath, "pom.xml"))) {
                const { version: mavenVersion, deps } = await (0, javaproyect_1.getMavenInfo)(rootPath);
                techs = ["Java (Maven)", ...deps];
                languageV = await (0, languajeVersion_1.getLanguagesVersions)(rootPath, [
                    { language: "java", command: "java --version" },
                    { language: "javac", command: "javac -version" },
                    { language: "JAVA_HOME", command: "echo $JAVA_HOME" }
                ]);
                version = mavenVersion;
            }
            else {
                const { version: gradleVersion, deps, scripts: gradleScripts } = (0, javaproyect_1.getGradleInfo)(rootPath);
                techs = ["Java (Gradle)", ...deps];
                languageV = await (0, languajeVersion_1.getLanguagesVersions)(rootPath, [
                    { language: "java", command: "java --version" },
                    { language: "javac", command: "javac -version" },
                    { language: "JAVA_HOME", command: "echo $JAVA_HOME" }
                ]);
                version = gradleVersion;
                scripts = gradleScripts;
            }
        }
        //  Build README
        const readmeContent = (0, readmeBuilder_1.buildReadme)({
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
            env
        });
        // Save README
        const readmePath = path.join(rootPath, "README.md");
        fs.writeFileSync(readmePath, readmeContent);
        vscode.window.showInformationMessage("README.md generado con éxito 🚀");
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=extension.js.map