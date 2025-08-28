import * as fs from "fs";
import * as path from "path";

export function isNodeProject(rootPath: string): boolean {
	return fs.existsSync(path.join(rootPath, "package.json"));
}

export function isPythonProject(rootPath: string): boolean {
	return (
		fs.existsSync(path.join(rootPath, "requirements.txt")) ||
		fs.existsSync(path.join(rootPath, "pyproject.toml"))
	);
}

export function isJavaProject(rootPath: string): boolean {
	return (
		fs.existsSync(path.join(rootPath, "pom.xml")) ||
		fs.existsSync(path.join(rootPath, "build.gradle"))
	);
}
