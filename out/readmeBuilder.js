"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReadme = buildReadme;
const path = __importStar(require("path"));
const buildTable_1 = __importDefault(require("./buildTable"));
const scriptTable_1 = require("./scriptTable");
function section(title, content) {
    return content && content.trim() !== "" ? `\n## ${title}\n${content}\n` : "";
}
function buildReadme(data) {
    return `# ${path.basename(data.rootPath)}
${section("🏷 Version", data.version !== "Not defined" ? data.version : "")}
${section("📜 License", data.license !== "Not defined" ? data.license : "")}
${section("🛠️ Basic requirements", data.languageV.length ? data.languageV.map(s => `- \`${s}\``).join("\n") : "")}
${section("📖 Description", "⚡ Replace this section with a short description of your project (what it does, why it exists)")}
${data.devDep.length ? (0, buildTable_1.default)(data.techs, "⚙️ Prod stack technologies") : ""}
${data.devDep.length ? (0, buildTable_1.default)(data.devDep, "⚙️ Dev stack technologies") : ""}
${data.scripts.length ? (0, scriptTable_1.buildScriptsTable)(data.scripts) : ""}

${section("Env variable", data.env.length ? data.env.map(s => `- \`${s}\``).join("\n") : "")}
${section("🌐 Deployment & Infrastructure", data.infraTools.length ? data.infraTools.join(", ") : "")}
${data.repo && data.repo !== "No repository found" ?
        `\n## Clone repository\n\`\`\`bash\ngit clone ${data.repo}\n\`\`\`\n` : ""}
${section("📂 Project structure", "```\n" + data.structure + "\n```")}`;
}
//# sourceMappingURL=readmeBuilder.js.map