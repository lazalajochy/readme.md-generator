import { exec } from "child_process";

/**
 * Obtiene los repositorios remotos de Git del proyecto.
 * @returns Promise<string> con el resultado de `git remote -v`.
 */

export function getRepoUrl(cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("git remote get-url origin", { cwd }, (error, stdout, stderr) => {
      if (error) return reject(`Error: ${error.message}`);
      if (stderr) return reject(`Stderr: ${stderr}`);
      resolve(stdout.trim()); // Aquí obtienes solo la URL
    });
  });
}