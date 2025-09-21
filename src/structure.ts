import * as fs from "fs";
import * as path from "path";

const ignored = [
  "node_modules", ".git", ".vscode", "dist", "build", ".idea", 
  ".DS_Store", ".firebase", "package-lock.json",
  ".gitignore", ".prettierrc", ".firebaserc", ".eslintrc.js", ".env", ".cache"
];

export function getFolderStructure(
  dir: string,
  prefix = "",
  depth = 0,
  maxDepth = 2 
): string {
  const files = fs.readdirSync(dir).filter(f => !ignored.includes(f));
  let result = "";

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const isLast = index === files.length - 1;
    const pointer = isLast ? "└── " : "├── ";

    result += prefix + pointer + file + "\n";

    if (stats.isDirectory() && depth < maxDepth - 1) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      result += getFolderStructure(filePath, newPrefix, depth + 1, maxDepth);
    }
  });

  return result;
}
