import * as path from "path";
import { ReadmeData } from "./interface";
import buildDepTable from "./buildTable";
import { buildScriptsTable } from "./scriptTable";

function section(title: string, content: string): string {
  return content && content.trim() !== "" ? `\n## ${title}\n${content}\n` : "";
}

export function buildReadme(data: ReadmeData): string {
  return `# ${path.basename(data.rootPath)}
${section("🏷 Version", data.version !== "Not defined" ? data.version : "")}
${section("📜 License", data.license !== "Not defined" ? data.license : "")}
${section("🛠️ Basic requirements",
  data.languageV.length ? data.languageV.map(s => `- \`${s}\``).join("\n") : ""
)}
${section("📖 Description", "⚡ Replace this section with a short description of your project (what it does, why it exists)")}
${data.devDep.length ? buildDepTable(data.techs, "⚙️ Prod stack technologies") : ""}
${data.devDep.length ? buildDepTable(data.devDep, "⚙️ Dev stack technologies") : ""}
${data.scripts.length ? buildScriptsTable(data.scripts) : ""}

${section("Env variable", data.env.length ? data.env.map(s => `- \`${s}\``).join("\n") : "")}
${section("🌐 Deployment & Infrastructure", data.infraTools.length ? data.infraTools.join(", ") : "")}
${data.repo && data.repo !== "No repository found" ? 
`\n## Clone repository\n\`\`\`bash\ngit clone ${data.repo}\n\`\`\`\n` : ""}
${section("📂 Project structure", "```\n" + data.structure + "\n```")}`;
}
