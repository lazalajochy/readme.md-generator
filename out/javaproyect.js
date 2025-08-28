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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMavenInfo = getMavenInfo;
exports.getGradleInfo = getGradleInfo;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const xml2js = __importStar(require("xml2js"));
async function getMavenInfo(rootPath) {
    const pomPath = path.join(rootPath, "pom.xml");
    if (!fs.existsSync(pomPath))
        return { version: "unknown-version", deps: [] };
    const xmlContent = fs.readFileSync(pomPath, "utf8");
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlContent);
    const version = result.project.version?.[0] || "unknown-version";
    // 📌 Extraer properties para resolver ${...}
    const props = {};
    if (result.project.properties) {
        for (const key in result.project.properties[0]) {
            props[key] = result.project.properties[0][key][0];
        }
    }
    // 📌 Procesar dependencias
    const deps = (result.project.dependencies?.[0]?.dependency || []).map((dep) => {
        const groupId = dep.groupId?.[0] || "unknown-group";
        const artifactId = dep.artifactId?.[0] || "unknown-artifact";
        let depVersion = dep.version?.[0] || "unknown-version";
        // Resolver ${prop}
        if (depVersion.startsWith("${") && depVersion.endsWith("}")) {
            const propName = depVersion.slice(2, -1); // quita ${ y }
            depVersion = props[propName] || `unknown-${propName}`;
        }
        return `${groupId}:${artifactId}:${depVersion}`;
    });
    return { version, deps };
}
// -----------------------------
// Obtener versión y dependencias de Gradle (básico)
// -----------------------------
function getGradleInfo(rootPath) {
    const gradlePath = path.join(rootPath, "build.gradle");
    const gradleKtsPath = path.join(rootPath, "build.gradle.kts");
    const filePath = fs.existsSync(gradlePath) ? gradlePath : gradleKtsPath;
    if (!fs.existsSync(filePath))
        return { version: "unknown-version", deps: [], scripts: [] };
    const content = fs.readFileSync(filePath, "utf8");
    // Versión del proyecto
    const versionMatch = content.match(/version\s*=\s*["']([^"']+)["']/);
    const version = versionMatch ? versionMatch[1] : "unknown-version";
    // Dependencias (ejemplo: implementation "group:artifact:version")
    const deps = [...content.matchAll(/(?:implementation|api|compileOnly|runtimeOnly)\s+["']([^"']+)["']/g)]
        .map(m => m[1]);
    // Scripts/tareas (ejemplo: task build)
    const scripts = [...content.matchAll(/task\s+(\w+)/g)].map(m => m[1]);
    return { version, deps, scripts };
}
//# sourceMappingURL=javaproyect.js.map