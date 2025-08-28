import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

export async function getMavenInfo(rootPath: string): Promise<{ version: string; deps: string[] }> {
    const pomPath = path.join(rootPath, "pom.xml");
    if (!fs.existsSync(pomPath)) return { version: "unknown-version", deps: [] };

    const xmlContent = fs.readFileSync(pomPath, "utf8");
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlContent);

    const version = result.project.version?.[0] || "unknown-version";

    // 📌 Extraer properties para resolver ${...}
    const props: Record<string, string> = {};
    if (result.project.properties) {
        for (const key in result.project.properties[0]) {
            props[key] = result.project.properties[0][key][0];
        }
    }

    // 📌 Procesar dependencias
    const deps = (result.project.dependencies?.[0]?.dependency || []).map((dep: any) => {
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
export function getGradleInfo(rootPath: string): { version: string; deps: string[]; scripts: string[] } {
    const gradlePath = path.join(rootPath, "build.gradle");
    const gradleKtsPath = path.join(rootPath, "build.gradle.kts");
    const filePath = fs.existsSync(gradlePath) ? gradlePath : gradleKtsPath;

    if (!fs.existsSync(filePath)) return { version: "unknown-version", deps: [], scripts: [] };

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
