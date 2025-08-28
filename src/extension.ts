import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { DEP_TO_TECH } from "./techs";

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
		const techs = getProdDependencies(rootPath);

		const devDep = getDevDependencies(rootPath)

		// 3. Detectar scripts de package.json
		const scripts = getScripts(rootPath);

		const version = getProyectVersion(rootPath)


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


function readPackageJson(rootPath: string): any | null {
	const pkgPath = path.join(rootPath, "package.json");
	if (!fs.existsSync(pkgPath)) return null;
	return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}



function getProdDependencies(rootPath: string): string[] {
	const pkg = readPackageJson(rootPath);
	if (!pkg) return [];

	const deps = { ...pkg.dependencies };
	return Object.keys(DEP_TO_TECH)
		.filter(dep => deps[dep])
		.map(dep => DEP_TO_TECH[dep]);
}



function getDevDependencies(rootPath: string): string[] {
	const pkg = readPackageJson(rootPath);
	if (!pkg) return [];

	const devDep = { ...pkg.devDependencies };
	const techs: string[] = Object.keys(devDep).filter(dep => devDep[dep]).map(dep => dep);

	// Revisar docker-compose
	const dockerFile = path.join(rootPath, "docker-compose.yml");
	if (fs.existsSync(dockerFile)) techs.push("docker-compose");

	return techs;
}


function getProyectVersion(rootPath: string): string {

	const pkgPath = path.join(rootPath, "package.json");
	if (fs.existsSync(pkgPath)) {
		const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		return pkgJson.version || "unknown-version";
	}
	return "unknown-version";
}


// Función para listar scripts de package.json
function getScripts(rootPath: string): string[] {
	const pkg = readPackageJson(rootPath);
	return pkg?.scripts ? Object.keys(pkg.scripts) : [];
}

