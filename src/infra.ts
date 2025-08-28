import * as fs from "fs";
import * as path from "path";
import { INFRA_TOOLS } from "./techs";

export function getInfrastructureTools(rootPath: string): string[] {
	const foundTools: string[] = [];
	for (const file in INFRA_TOOLS) {
		const filePath = path.join(rootPath, file);
		if (fs.existsSync(filePath)) {
			foundTools.push(INFRA_TOOLS[file]);
		}
	}
	return foundTools;
}
