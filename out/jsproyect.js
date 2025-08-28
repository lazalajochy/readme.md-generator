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
exports.getProdDependencies = getProdDependencies;
exports.getDevDependencies = getDevDependencies;
exports.getPackageField = getPackageField;
exports.getScripts = getScripts;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const techs_1 = require("./techs");
function readPackageJson(rootPath) {
    const pkgPath = path.join(rootPath, "package.json");
    if (!fs.existsSync(pkgPath))
        return null;
    return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}
function getProdDependencies(rootPath) {
    const pkg = readPackageJson(rootPath);
    if (!pkg)
        return [];
    const deps = { ...pkg.dependencies };
    return Object.keys(techs_1.DEP_TO_TECH)
        .filter(dep => deps[dep])
        .map(dep => techs_1.DEP_TO_TECH[dep]);
}
//vsce publish. vsce package
function getDevDependencies(rootPath) {
    const pkg = readPackageJson(rootPath);
    if (!pkg)
        return [];
    const devDep = { ...pkg.devDependencies };
    const techs = Object.keys(devDep).filter(dep => devDep[dep]).map(dep => dep);
    return techs;
}
function getPackageField(rootPath, field) {
    const pkgPath = path.join(rootPath, "package.json");
    if (fs.existsSync(pkgPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        return pkgJson[field] || `unknown-${field}`;
    }
    return `unknown-${field}`;
}
// Función para listar scripts de package.json
function getScripts(rootPath) {
    const pkg = readPackageJson(rootPath);
    return pkg?.scripts ? Object.keys(pkg.scripts) : [];
}
//# sourceMappingURL=jsproyect.js.map