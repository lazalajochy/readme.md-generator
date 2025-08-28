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
        const techs = detectTechnologies(rootPath);
        // 3. Detectar scripts de package.json
        const scripts = getScripts(rootPath);
        // 4. Armar contenido del README
        const readmeContent = `# ${path.basename(rootPath)}

## 📖 Descripción
Este proyecto fue generado automáticamente por la extensión **README Generator**.

## ⚙️ Tecnologías
${techs.join(", ") || "No detectadas"}

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
// Función para detectar tecnologías por package.json
function detectTechnologies(rootPath) {
    const techs = [];
    const pkgPath = path.join(rootPath, "package.json");
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        // 1️⃣ Frameworks y librerías frontend
        if (deps["react"])
            techs.push("React");
        if (deps["react-dom"])
            techs.push("React DOM");
        if (deps["vue"])
            techs.push("Vue.js");
        if (deps["angular"])
            techs.push("Angular");
        if (deps["svelte"])
            techs.push("Svelte");
        if (deps["next"])
            techs.push("Next.js");
        if (deps["nuxt"])
            techs.push("Nuxt.js");
        if (deps["gatsby"])
            techs.push("Gatsby");
        if (deps["typescript"])
            techs.push("TypeScript");
        //2️⃣ Frameworks y librerías backend
        if (deps["express"])
            techs.push("Express");
        if (deps["koa"])
            techs.push("Koa");
        if (deps["fastify"])
            techs.push("Fastify");
        if (deps["nestjs"])
            techs.push("NestJS");
        if (deps["hapi"])
            techs.push("Hapi");
        // DB
        if (deps["pg"])
            techs.push("PostgreSQL");
        if (deps["mysql"])
            techs.push("MySQL");
        if (deps["mongodb"])
            techs.push("MongoDB");
        if (deps["sqlite3"])
            techs.push("SQLite");
        if (deps["typeorm"])
            techs.push("TypeORM");
        if (deps["prisma"])
            techs.push("Prisma");
        // 4️⃣ Lenguajes y herramientas de compilación
        if (deps["typescript"])
            techs.push("TypeScript");
        if (deps["babel"])
            techs.push("Babel");
        if (deps["webpack"])
            techs.push("Webpack");
        if (deps["vite"])
            techs.push("Vite");
        if (deps["rollup"])
            techs.push("Rollup");
        // 5️⃣ Testing y calidad de código
        if (deps["jest"])
            techs.push("Jest");
        if (deps["mocha"])
            techs.push("Mocha");
        if (deps["chai"])
            techs.push("Chai");
        if (deps["eslint"])
            techs.push("ESLint");
        if (deps["prettier"])
            techs.push("Prettier");
        if (deps["dotenv"])
            techs.push("dotenv");
        if (deps["axios"])
            techs.push("Axios");
        if (deps["lodash"])
            techs.push("Lodash");
        if (deps["cors"])
            techs.push("CORS");
        if (deps["body-parser"])
            techs.push("body-parser");
    }
    return techs;
}
// Función para listar scripts de package.json
function getScripts(rootPath) {
    const pkgPath = path.join(rootPath, "package.json");
    if (!fs.existsSync(pkgPath))
        return [];
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkg.scripts ? Object.keys(pkg.scripts) : [];
}
//# sourceMappingURL=extension.js.map