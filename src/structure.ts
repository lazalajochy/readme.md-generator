import * as fs from "fs";
import * as path from "path";

const ignoredFolders = ["node_modules", ".git", ".gitignore", ".prettierrc", ".eslintrc.js", ".vscode", "dist", "build", ".idea",".env"];

export function getFolderStructure(dir: string, depth = 0): string {
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