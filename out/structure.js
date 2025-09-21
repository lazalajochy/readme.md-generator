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
exports.getFolderStructure = getFolderStructure;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ignored = [
    "node_modules", ".git", ".vscode", "dist", "build", ".idea",
    ".DS_Store", ".firebase", "package-lock.json",
    ".gitignore", ".prettierrc", ".firebaserc", ".eslintrc.js", ".env", ".cache"
];
function getFolderStructure(dir, prefix = "", depth = 0, maxDepth = 2) {
    const files = fs.readdirSync(dir).filter(f => !ignored.includes(f));
    let result = "";
    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;
        const pointer = isLast ? "└── " : "├── ";
        result += prefix + pointer + file + "\n";
        if (stats.isDirectory() && depth < maxDepth - 1) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            result += getFolderStructure(filePath, newPrefix, depth + 1, maxDepth);
        }
    });
    return result;
}
//# sourceMappingURL=structure.js.map