import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { DEP_TO_TECH } from "./techs";

function readPackageJson(rootPath: string): any | null {
	const pkgPath = path.join(rootPath, "package.json");
	if (!fs.existsSync(pkgPath)) return null;
	return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}



export function getProdDependencies(rootPath: string): string[] {
	const pkg = readPackageJson(rootPath);
	if (!pkg) return [];

	const deps = { ...pkg.dependencies };
	return Object.keys(DEP_TO_TECH)
		.filter(dep => deps[dep])
		.map(dep => DEP_TO_TECH[dep]);
}


//vsce publish. vsce package
export function getDevDependencies(rootPath: string): string[] {
	const pkg = readPackageJson(rootPath);
	if (!pkg) return [];

	const devDep = { ...pkg.devDependencies };
	const techs: string[] = Object.keys(devDep).filter(dep => devDep[dep]).map(dep => dep);



	return techs;
}





export function getPackageField(rootPath: string, field: string): string {
	const pkgPath = path.join(rootPath, "package.json");

	if (fs.existsSync(pkgPath)) {
		const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		return pkgJson[field] || `unknown-${field}`;
	}

	return `unknown-${field}`;
}


// Función para listar scripts de package.json
export function getScripts(rootPath: string): string[] {
	const pkg = readPackageJson(rootPath);
	return pkg?.scripts ? Object.keys(pkg.scripts) : [];
}


