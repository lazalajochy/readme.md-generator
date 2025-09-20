export default function buildDepTable(deps: string[], title: string): string {
  if (!deps.length) return "";

  const categories: { [key: string]: (dep: string) => boolean } = {
    "NestJS & Frameworks": (dep) => dep.startsWith("@nestjs/"),
    "HTTP Frameworks": (dep) =>
      ["express", "fastify", "koa", "hapi", "axios"].some((k) =>
        dep.toLowerCase().includes(k)
      ),
    "Databases": (dep) =>
      ["pg", "mysql", "mongodb", "redis", "sqlite", "mssql"].some((k) =>
        dep.toLowerCase().includes(k)
      ),
    "ORM / Query Builders": (dep) =>
      ["prisma", "typeorm", "sequelize", "knex", "objection"].some((k) =>
        dep.toLowerCase().includes(k)
      ),
    "Typings": (dep) => dep.startsWith("@types/"),
    "Linting & Formatting": (dep) =>
      dep.toLowerCase().includes("eslint") ||
      dep.toLowerCase().includes("prettier"),
    "Testing": (dep) =>
      ["jest", "mocha", "chai", "supertest"].some((k) =>
        dep.toLowerCase().includes(k)
      ),
    "Build & Runtime": (dep) =>
      dep.startsWith("ts-") ||
      ["typescript", "source-map-support", "nodemon", "ts-node"].includes(
        dep.toLowerCase()
      ),
    "Utils": (dep) =>
      ["lodash", "dayjs", "moment", "dotenv", "uuid"].some((k) =>
        dep.toLowerCase().includes(k)
      ),
  };

  const grouped: { [key: string]: string[] } = {};
  for (const dep of deps) {
    let found = false;
    for (const [cat, check] of Object.entries(categories)) {
      if (check(dep)) {
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(dep);
        found = true;
        break;
      }
    }
    if (!found) {
      if (!grouped["Others"]) grouped["Others"] = [];
      grouped["Others"].push(dep);
    }
  }

  let table = `| Category | Packages |\n|----------|----------|\n`;
  for (const [cat, items] of Object.entries(grouped)) {
    table += `| ${cat} | ${items.join(", ")} |\n`;
  }

  return `\n## ${title}\n${table}`;
}
