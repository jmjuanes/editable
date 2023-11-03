import React from "react";
import {uid} from "uid/secure";
import {VERSION, CDN_URL, CELL_TYPES, CONSOLE_LEVELS} from "./constants.js";
import {ENDL, MIME_TYPES, FILE_EXTENSIONS} from "./constants.js";
import {parseYaml, stringifyYaml, saveToFile} from "./utils.js";

// Note: babel is added as an external dependency
// See this issue: https://github.com/babel/babel/issues/14301
// import * as Babel from "@babel/standalone";

const AsyncFunction = Object.getPrototypeOf(async function (){}).constructor;

// Create a new notebook context
export const createNotebookContext = () => ({
    version: VERSION,
    // This variable will store packages imported in code cells
    // key: package name (for example "react" or "react@18.2.0" when importing specific versions)
    // value: package content, returned from CDN
    modules: {
        "react": {
            default: React,
        },
    },
});

// Create a new cell element
export const createNotebookCell = (type, initialValue = "") => {
    return {
        id: uid(6),
        type: type || CELL_TYPES.CODE,
        value: initialValue || "",
    };
};

const getNotebookFilename = notebook => {
    return (notebook?.title || "untitled").toLowerCase().trim().replace(/\s/g, "_");
};

// Create a new notebook
export const createNotebook = () => {
    return {
        version: VERSION,
        title: "Untitled Notebook",
        author: "",
        tags: [],
        cells: [
            // createNotebookCell(CELL_TYPES.TEXT, ""),
            createNotebookCell(CELL_TYPES.CODE, `return "Hello world!";`),
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
};

// Save notebook as Yaml string
export const saveNotebook = notebook => {
    return stringifyYaml(notebook);
};

// Save notebook as yaml
export const saveNotebookAsYaml = notebook => {
    return saveNotebook(notebook).then(data => {
        return saveToFile(data, MIME_TYPES.YAML, {
            name: getNotebookFilename(notebook),
            extension: FILE_EXTENSIONS.YAML,
        });
    });
};

// Export notebook as markdown
export const exportNotebook = notebook => {
    return new Promise(resolve => {
        const data = [
            "---",
            `title: ${JSON.stringify(notebook.title || "Untitled")}`,
            `author: ${JSON.stringify(notebook.author || "")}`,
            `tags: ${JSON.stringify(notebook.tags)}`,
            "---",
            "",
            ...notebook.cells.map(cell => {
                if (cell.type === CELL_TYPES.CODE) {
                    const codeBlock = [
                        "```{javascript, id=" + JSON.stringify(cell.id) + "}",
                        cell.value.trim(),
                        "```",
                        "",
                    ];
                    return codeBlock.join(ENDL);
                }
                // Other case, just return cell value
                return cell.value;
            }),
        ];
        return resolve(data.join(ENDL));
    });
};

// Export notebook as Markdown file
export const exportNotebookToFile = notebook => {
    return exportNotebook(notebook).then(data => {
        return saveToFile(data, MIME_TYPES.MARKDOWN, {
            name: getNotebookFilename(notebook),
            extension: FILE_EXTENSIONS.MARKDOWN,
        });
    });
};

// Create function code
const createFunctionCode = rawCode => {
    // Replace import and export statemenets from code
    // We need to do this before transpiling code with babel
    const code = rawCode.trim()
        // Replace imports
        // Case 1: import default export of package
        .replace(/^import\s+(\w+)?\s+from\s+"([\w@:\-\.-/]+)?";/gm, `const $1 = (await __import("$2"))?.default;`)
        // Case 2: import all exports to a single namespace from package (using import * as)
        .replace(/^import\s+\*\s+as\s+(\w+)?\s+from\s+"([\w@:\-\.-/]+)?";/gm, `const $1 = await __import("$2");`)
        // Case 3: import only specific exports from package
        .replace(/^import\s+(\{[\w, ]+\})?\s+from\s+"([\w@:\-\.\/]+)?";/gm, `const $1 = await __import("$2");`)
        // Replace exports
        // Case 1: export default
        .replace(/^export\s+default\s+(.+)/gm, `__export.default = $1`)
        // Case 2: named export
        .replace(/^export\s+(function|class)\s+([\w]+)/gm, `__export["$2"] = $1`)
        .replace(/^export\s+(?:const)\s+([\w]+)/gm, `__export["$1"]`)
        // Case 3: export declared variables
        .replace(/^export\s+([\w]+)/gm, `__export["$1"] = $1`)
        .replace(/^export\s+\{([\w,\s]+?)\}/gm, (match, items) => {
            return items.split(",").map(s => `__export["${s.trim()}"] = ${s.trim()};`).join(" ");
        });
    // Transpile code with babel
    const transformed = Babel.transform(code, {
        presets: [
            ["env", {modules: false}],
            "react",
        ],
        parserOpts: {
            strictMode: false,
            allowAwaitOutsideFunction: true,
            allowReturnOutsideFunction: true,
            allowImportExportEverywhere: true,
        },
    });
    return `return (async () => {${transformed.code}})();`;
};

// Execute the provide command
export const executeNotebookCell = async (cell, code, context) => {
    const result = {
        logs: [],
        error: false,
    };
    // Initialize console instance
    const consoleInstance = {
        clear: () => result.logs = [],
        ...Object.fromEntries(Object.values(CONSOLE_LEVELS).map(level => {
            // TODO: we would need to fully support console[LEVEL] arguments
            return [level, message => {
                result.logs.push({level, message});
            }];
        })),
    };
    // Internal function for importing packages
    const __import = async name => {
        // Check for importing modules from other cells
        if (name.startsWith("cell:")) {
            const id = name.replace("cell:", "");
            if (!context.modules[id]) {
                throw new Error(`Cell '${id}' does not export any module.`);
            }
            return context.modules[id];
        }
        // Import modules from CDN
        if (typeof context.modules[name] === "undefined") {
            context.modules[name] = await import(/*webpackIgnore: true*/`${CDN_URL}${name}`);
        }
        // Return package from cache
        return context.modules[name];
    };
    try {
        const __export = {}; // Store exported modules from cells
        const fnCode = createFunctionCode(code);
        const fn = new AsyncFunction("console", "__import", "__export", fnCode);
        result.value = await fn.call(context, consoleInstance, __import, __export);
        // Save exported modules in internal modules cache
        // Note that if cell does not export any module, it will be initialized/reset to 'null' 
        context.modules[cell] = Object.keys(__export).length > 0 ? __export : null;
    }
    catch(error) {
        // Save error message in result and set as error type
        result.error = true;
        result.errorType = error.name;
        result.errorMessage = error.message;
    }
    // Return result object
    return result;
};
