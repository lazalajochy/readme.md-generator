import * as path from "path";

import { ReadmeData } from "./interface";

export function buildReadme(data: ReadmeData): string {
    return `# ${path.basename(data.rootPath)}

## 🏷 Version: ${data.version}
## 📜 License: ${data.license}


## 🛠️ Basic requirements
${data.languageV.length ? data.languageV.map(s => `- \`${s}\``).join("\n") : "Not defined"}


## 📖 Description
 ⚡ Replace this section with a short description of your project (what it does, why it exists)


## ⚙️ Prod stack technologies
${data.techs.join(", ") || "Not found"}

## ⚙️ Dev stack technologies
${data.devDep.join(", ") || "Not found"}

## 📜 Scripts available
${data.scripts.length ? data.scripts.map(s => `- \`${s}\``).join("\n") : "Not defined"}

## 🌐 Deployment & Infrastructure
${data.infraTools.join(", ") || "Not found"}

## Clone repository
\`\`\`bash
git clone ${data.repo !== "No repository found" ? data.repo : ""}
\`\`\`

## 📂 Project structure
\`\`\`
${data.structure}
\`\`\`
`;
}
