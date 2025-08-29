import * as fs from "fs";
import * as path from "path";

export function getTechPython(rootPath: string): string[] {
    const requirements = path.join(rootPath, "requirements.txt");

    if (!fs.existsSync(requirements)) return [];

    const content = fs.readFileSync(requirements, "utf-8");
    return content.split("\n").filter(line => line.trim() !== "");
}