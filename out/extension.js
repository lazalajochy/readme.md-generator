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
function activate(context) {
    let disposable = vscode.commands.registerCommand("readme-generator.createReadme", async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace open");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        // 📌 Repositorio
        const repo = await (0, repo_1.getRepoUrl)(rootPath);
        // 📌 Infraestructura
        const infraTools = (0, infra_1.getInfrastructureTools)(rootPath);
        // 📌 Estructura del proyecto
        const structure = (0, structure_1.getFolderStructure)(rootPath);
        // 📌 Defaults
        let techs = [];
        let devDep = [];
        let scripts = [];
        let version = "unknown-version";
        let license = "unknown-license";
        // --------------------
        // Detectores
        // --------------------
        if ((0, detectors_1.isNodeProject)(rootPath)) {
            techs = (0, jsproyect_1.getProdDependencies)(rootPath);
            devDep = (0, jsproyect_1.getDevDependencies)(rootPath);
            scripts = (0, jsproyect_1.getScripts)(rootPath);
            version = (0, jsproyect_1.getPackageField)(rootPath, "version");
            license = (0, jsproyect_1.getPackageField)(rootPath, "license");
        }
        else if ((0, detectors_1.isPythonProject)(rootPath)) {
            techs = ["Python"];
        }
        else if ((0, detectors_1.isJavaProject)(rootPath)) {
            techs = ["Java"];
        }
        // 📌 Construir README
        const readmeContent = (0, readmeBuilder_1.buildReadme)({
            rootPath,
            repo,
            version,
            license,
            techs,
            devDep,
            scripts,
            infraTools,
            structure,
        });
        // 📌 Guardar README
        const readmePath = path.join(rootPath, "README.md");
        fs.writeFileSync(readmePath, readmeContent);
        vscode.window.showInformationMessage("README.md generado con éxito 🚀");
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=extension.js.map