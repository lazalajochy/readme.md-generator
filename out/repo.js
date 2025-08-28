"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoUrl = getRepoUrl;
const child_process_1 = require("child_process");
/**
 * Obtiene los repositorios remotos de Git del proyecto.
 * @returns Promise<string> con el resultado de `git remote -v`.
 */
function getRepoUrl(cwd) {
    return new Promise((resolve) => {
        (0, child_process_1.exec)("git remote get-url origin", { cwd }, (error, stdout) => {
            if (error) {
                return resolve(null);
            }
            resolve(stdout.trim() || null);
        });
    });
}
//# sourceMappingURL=repo.js.map