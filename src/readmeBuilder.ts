import * as path from "path";
import { ReadmeData } from "./interface";

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
${section("⚙️ Prod stack technologies", data.techs.length ? data.techs.join(", ") : "")}
${section("⚙️ Dev stack technologies", data.devDep.length ? data.devDep.join(", ") : "")}
${section("📜 Scripts available", data.scripts.length ? data.scripts.map(s => `- \`${s}\``).join("\n") : "")}
${section("Env variable", data.env.length ? data.env.map(s => `- \`${s}\``).join("\n") : "")}
${section("🌐 Deployment & Infrastructure", data.infraTools.length ? data.infraTools.join(", ") : "")}
${data.repo && data.repo !== "No repository found" ? 
`\n## Clone repository\n\`\`\`bash\ngit clone ${data.repo}\n\`\`\`\n` : ""}
${section("📂 Project structure", "```\n" + data.structure + "\n```")}`;
}
