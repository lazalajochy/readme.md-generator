export interface ReadmeData {
    rootPath: string;
    languageV: string[];
    repo: string | null;
    version: string;
    license: string;
    techs: string[];
    devDep: string[];
    scripts: string[];
    infraTools: string[];
    structure: string;
    env:string[];
}

export interface CommandInfo  {
  language: string;  
  command: string;  
}
