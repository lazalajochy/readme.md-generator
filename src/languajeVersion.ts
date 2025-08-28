import { exec } from "child_process";
import { CommandInfo } from "./interface";

/**
 * Gets the project's remote Git repositories.
 * @returns Promise<string> with the result of `the language version`.
 */


export function getLanguagesVersions(
    cwd: string,
    commands: CommandInfo[]
): Promise<string[]> {
    return Promise.all(
        commands.map(
            (cmd) =>
                new Promise<string>((resolve) => {
                    exec(cmd.command, { cwd }, (error, stdout) => {
                        if (error) {
                            return resolve(`${cmd.language} >= not found`);
                        }
                        resolve(`${cmd.language} >= ${stdout.trim()}`);
                    });
                })
        )
    );
}