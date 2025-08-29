import * as fs from "fs";
import * as path from "path";

export function readEnvVariable(rootPath: string): string[]  {
  const env = path.join(rootPath, ".env");

  if (!fs.existsSync(env)) return [];

  const content = fs.readFileSync(env, "utf-8");
  return content.split("\n").filter(line => line.trim() !== "");
}
