import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
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
function getFolderStructure(dir: string, depth = 0): string {
  const files = fs.readdirSync(dir).filter(f => !ignoredFolders.includes(f));
  let result = "";

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const indent = "  ".repeat(depth);

    if (stats.isDirectory()) {
      result += `${indent}📂 ${file}\n${getFolderStructure(filePath, depth + 1)}`;
    } else {
      result += `${indent}📄 ${file}\n`;
    }
  }

  return result;
}

// Función para detectar tecnologías por package.json
function detectTechnologies(rootPath: string): string[] {
  const techs: string[] = [];
  const pkgPath = path.join(rootPath, "package.json");

  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps["react"]) techs.push("React");
    if (deps["next"]) techs.push("Next.js");
    if (deps["express"]) techs.push("Express");
    if (deps["nestjs"]) techs.push("NestJS");
    if (deps["typeorm"]) techs.push("TypeORM");
    if (deps["prisma"]) techs.push("Prisma");
    if (deps["pg"]) techs.push("PostgreSQL");
    if (deps["sqlite3"]) techs.push("SQLite");
  }

  return techs;
}

// Función para listar scripts de package.json
function getScripts(rootPath: string): string[] {
  const pkgPath = path.join(rootPath, "package.json");
  if (!fs.existsSync(pkgPath)) return [];

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return pkg.scripts ? Object.keys(pkg.scripts) : [];
}
