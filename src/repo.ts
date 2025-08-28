import { exec } from "child_process";

/**
 * Obtiene los repositorios remotos de Git del proyecto.
 * @returns Promise<string> con el resultado de `git remote -v`.
 */

export function getRepoUrl(cwd: string): Promise<string | null> {
  return new Promise((resolve) => {
    exec("git remote get-url origin", { cwd }, (error, stdout) => {
      if (error) {
        return resolve(null);
      }
      resolve(stdout.trim() || null);
    });
  });
}