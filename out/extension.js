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
const techs_1 = require("./techs");
function activate(context) {
    let disposable = vscode.commands.registerCommand("readme-generator.createReadme", async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("No workspace open");
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        // 1. Escanear estructura del proyecto
        const structure = getFolderStructure(rootPath);
        // 2. Detectar tecnologías
        const techs = getProdDependencies(rootPath);
        const devDep = getDevDependencies(rootPath);
        // 3. Detectar scripts de package.json
        const scripts = getScripts(rootPath);
        const version = getProyectVersion(rootPath);
        // 4. Armar contenido del README
        const readmeContent = `# ${path.basename(rootPath)}

		

		
## Version: ${version}
		
## 📖 Descripción
Este proyecto fue generado automáticamente por la extensión **README Generator**.

## ⚙️ Tecnologías de produccion
${techs.join(", ") || "No detectadas"}


## ⚙️ Tecnologías de desarrollo
${devDep.join(", ") || "No detectadas"}

## 📜 Scripts disponibles
${scripts.length ? scripts.map(s => `- \`${s}\``).join("\n") : "No definidos"}

## 📂 Estructura del proyecto
\`\`\`
${structure}
\`\`\`
`;
        // 5. Guardar README.md
        const readmePath = path.join(rootPath, "README.md");
        fs.writeFileSync(readmePath, readmeContent);
        vscode.window.showInformationMessage("README.md generado con éxito 🚀");
    });
    context.subscriptions.push(disposable);
}
const ignoredFolders = ["node_modules", ".git", ".vscode", "dist", "build", ".idea"];
// Función para generar estructura de carpetas más clara
function getFolderStructure(dir, depth = 0) {
    const files = fs.readdirSync(dir).filter(f => !ignoredFolders.includes(f));
    let result = "";
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const indent = "  ".repeat(depth);
        if (stats.isDirectory()) {
            result += `${indent}📂 ${file}\n${getFolderStructure(filePath, depth + 1)}`;
        }
        else {
            result += `${indent}📄 ${file}\n`;
        }
    }
    return result;
}
function readPackageJson(rootPath) {
    const pkgPath = path.join(rootPath, "package.json");
    if (!fs.existsSync(pkgPath))
        return null;
    return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}
function getProdDependencies(rootPath) {
    const pkg = readPackageJson(rootPath);
    if (!pkg)
        return [];
    const deps = { ...pkg.dependencies };
    return Object.keys(techs_1.DEP_TO_TECH)
        .filter(dep => deps[dep])
        .map(dep => techs_1.DEP_TO_TECH[dep]);
}
function getDevDependencies(rootPath) {
    const pkg = readPackageJson(rootPath);
    if (!pkg)
        return [];
    const devDep = { ...pkg.devDependencies };
    const techs = Object.keys(devDep).filter(dep => devDep[dep]).map(dep => dep);
    // Revisar docker-compose
    const dockerFile = path.join(rootPath, "docker-compose.yml");
    if (fs.existsSync(dockerFile))
        techs.push("docker-compose");
    return techs;
}
function getProyectVersion(rootPath) {
    const pkgPath = path.join(rootPath, "package.json");
    if (fs.existsSync(pkgPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        return pkgJson.version || "unknown-version";
    }
    return "unknown-version";
}
// Función para listar scripts de package.json
function getScripts(rootPath) {
    const pkg = readPackageJson(rootPath);
    return pkg?.scripts ? Object.keys(pkg.scripts) : [];
}
//# sourceMappingURL=extension.js.map