import React from "react";
import {uid} from "uid/secure";
import {VERSION, CDN_URL, CELL_TYPES, CONSOLE_LEVELS} from "./constants.js";

// Note: babel is added as an external dependency
// See this issue: https://github.com/babel/babel/issues/14301
// import * as Babel from "@babel/standalone";

const AsyncFunction = Object.getPrototypeOf(async function (){}).constructor;

// Importing sections
const IMPORT_SECTIONS = {
    NONE: "",
    FRONTMATTER: "frontmatter",
    TEXT_CELL: "text_cell",
    CODE_CELL: "code_cell",
};

// Create a new notebook context
export const createNotebookContext = () => {
    return {
        // This variable will store packages imported in code cells
        // key: package name (for example "react" or "react@18.2.0" when importing specific versions)
        // value: package content, returned from CDN
        __packagesCache: {
            "react": {
                default: React,
            },
        },
    };
};

// Create a new cell element
export const createNotebookCell = (type, initialValue = "") => {
    return {
        id: uid(20),
        type: type || CELL_TYPES.CODE,
        value: initialValue || "",
        locked: false,
    };
};

// Create a new notebook
export const createNotebook = () => {
    return {
        version: VERSION,
        title: "untitled",
        isFork: false,
        locked: false,
        cells: [
            // createNotebookCell(CELL_TYPES.TEXT, ""),
            createNotebookCell(CELL_TYPES.CODE, `return "Hello world!";`),
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
};

// Export notebook as Markdown file
export const exportNotebook = notebook => {
    const endl = "\n";
    return new Promise(resolve => {
        const output = [
            "---",
            `title: '${notebook.title}'`,
            `createdAt: ${notebook.createdAt}`,
            `updatedAt: ${notebook.updatedAt}`,
            "---",
            "",
            ...notebook.cells.map(cell => {
                if (cell.type === CELL_TYPES.CODE) {
                    const codeBlock = [
                        "```{javascript editable=true}",
                        cell.value,
                        "```",
                        "",
                    ];
                    return codeBlock.join(endl);
                }
                // Other case, just return cell value
                return cell.value;
            }),
        ];
        return resolve(output.join(endl));
    });
};

// Import notebook from markdown file
export const importNotebook = data => {
    // const endl = "\n";
    // return new Promise(resolve => {
    //     const notebook = {
    //         ...createNotebook(),
    //         cells: [],
    //         locked: true,
    //     };
    //     let lastCell = null;
    //     let reading = IMPORT_SECTIONS.NONE;
    //     data.split(endl).forEach(line => {
    //         if (line === "---" && !reading) {
    //             reading = IMPORT_SECTIONS.FRONTMATTER;
    //         }
    //         else if (line === "---" && reading === IMPORT_SECTIONS.FRONTMATTER) {
    //             reading = IMPORT_SECTIONS.NONE;
    //         }
    //         // Check if we are reading the frontmatter value
    //         else if (reading === IMPORT_SECTIONS.FRONTMATTER) {
    //             const [name, value] = line.split(": ");
    //             notebook[name] = JSON.parse(value);
    //         }
    //         // Check if we are reading a code block
    //         else if (line === "```{javascript editable=true}") {
    //             if (reading === IMPORT_SECTIONS.TEXT_CELL && lastCell && lastCell.length > 0) {
    //                 notebook.cells.push(createNotebookCell(CELL_TYPES.TEXT, lastCell.join(endl)));
    //             }
    //             lastCell = [];
    //             reading = IMPORT_SECTIONS.CODE_CELL;
    //         }
    //         else if (line === "```" && reading === IMPORT_SECTIONS.CODE_CELL)
    //     });

    //     return resolve(notebook);
    // });
};

// Create function code
const createFunctionCode = rawCode => {
    // Replace import statemenets from code
    // We need to do this before transpiling code with babel
    const code = rawCode.trim()
        // Case 1: import default export of package
        .replace(/^import\s+(\w+)?\s+from\s+"([\w@\.-/]+)?";/gm, `const $1 = (await __import("$2"))?.default;`)
        // Case 2: import all exports to a single namespace from package (using import * as)
        .replace(/^import\s+\*\s+as\s+(\w+)?\s+from\s+"([\w@\.-/]+)?";/gm, `const $1 = await __import("$2");`)
        // Case 3: import only specific exports from package
        .replace(/^import\s+(\{[\w, ]+\})?\s+from\s+"([\w\@\.\/]+)?";/gm, `const $1 = await __import("$2");`);
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
export const executeNotebookCell = async (code, context) => {
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
        if (typeof context["__packagesCache"][name] === "undefined") {
            context["__packagesCache"][name] = await import(/*webpackIgnore: true*/`${CDN_URL}${name}`);
        }
        // Return package from cache
        return context["__packagesCache"][name];
    };
    // Execute provided code
    try {
        console.log(context);
        console.log(consoleInstance);

        const fnCode = createFunctionCode(code);
        console.log(fnCode);
        const fn = new AsyncFunction("console", "React", "__import", fnCode);
        result.value = await fn.call(context, consoleInstance, React, __import);
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
