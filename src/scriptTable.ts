export function buildScriptsTable(scripts: string[]): string {
  if (!scripts.length) return "";

  const SCRIPT_CATEGORIES: { [key: string]: { category: string; description: string } } = {
    build: { category: "Build", description: "Compiles the project" },
    format: { category: "Linting", description: "Formats code using Prettier" },
    start: { category: "Run", description: "Starts the app in production mode" },
    "start:dev": { category: "Run", description: "Starts the app in development mode (watch mode)" },
    "start:debug": { category: "Run", description: "Starts the app in debug mode" },
    "start:prod": { category: "Run", description: "Starts the app with production optimizations" },
    lint: { category: "Linting", description: "Runs ESLint to check for code issues" },
    test: { category: "Testing", description: "Runs all tests once" },
    "test:watch": { category: "Testing", description: "Runs tests in watch mode" },
    "test:cov": { category: "Testing", description: "Runs tests and generates coverage report" },
    "test:debug": { category: "Testing", description: "Runs tests in debug mode" },
    "test:e2e": { category: "Testing", description: "Runs end-to-end tests" },
  };

  let table = `| Script | Category | Description |\n|--------|----------|-------------|\n`;

  for (const script of scripts) {
    const info = SCRIPT_CATEGORIES[script] || {
      category: "Others",
      description: "Custom script",
    };
    table += `| ${script} | ${info.category} | ${info.description} |\n`;
  }

  return `\n## 📜 Scripts available\n\n${table}`;
}
