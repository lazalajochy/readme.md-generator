"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguagesVersions = getLanguagesVersions;
const child_process_1 = require("child_process");
/**
 * Gets the project's remote Git repositories.
 * @returns Promise<string> with the result of `the language version`.
 */
function getLanguagesVersions(cwd, commands) {
    return Promise.all(commands.map((cmd) => new Promise((resolve) => {
        (0, child_process_1.exec)(cmd.command, { cwd }, (error, stdout) => {
            if (error) {
                return resolve(`${cmd.language} >= not found`);
            }
            resolve(`${cmd.language} >= ${stdout.trim()}`);
        });
    })));
}
//# sourceMappingURL=languajeVersion.js.map