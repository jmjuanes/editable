import React from "react";
import {DataTable} from "@koridev/datatable";
import {CDN_URL, CONSOLE_LEVELS} from "./constants.js";

// Note: babel is added as an external dependency
// See this issue: https://github.com/babel/babel/issues/14301
// import * as Babel from "@babel/standalone";

const AsyncFunction = Object.getPrototypeOf(async function (){}).constructor;

// This variable will store packages imported in code cells
// key: package name (for example "react" or "react@18.2.0" when importing specific versions)
// value: package content, returned from CDN
const packagesCache = {
    "react": {
        default: React,
    },
};

// Internal function for importing packages
const __import = async name => {
    if (typeof packagesCache[name] === "undefined") {
        packagesCache[name] = await import(/*webpackIgnore: true*/`${CDN_URL}${name}`);
    }
    // Return package from cache
    return packagesCache[name];
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
        presets: ["env", "react"],
        parserOpts: {
            allowAwaitOutsideFunction: true,
            allowReturnOutsideFunction: true,
            allowImportExportEverywhere: true,
        },
    });
    return `return (async () => {${transformed.code}})();`;
};

// Create a new kori instance object
const createKoriInstance = () => {
    return Object.freeze({
        delay: time => {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        createTable: props => {
            return React.createElement(DataTable, props);
        },
    });
};

// Create a new console instance
const createConsoleInstance = () => {
    const consoleInstance = {
        _logs: [],
        clear: () => {
            consoleInstance._logs = [];
        },
    };
    // Register console log levels
    Object.values(CONSOLE_LEVELS).forEach(level => {
        // TODO: we would need to fully support console[LEVEL] arguments
        consoleInstance[level] = message => {
            consoleInstance._logs.push({
                level: level,
                message: message,
                time: Date.now(),
            });
        };
    });
    return consoleInstance;
};

// Execute the provide command
export const execute = async (code, context) => {
    const kori = createKoriInstance();
    const consoleInstance = createConsoleInstance();
    const result = {
        logs: consoleInstance._logs,
        error: false,
    };
    try {
        const fnCode = createFunctionCode(code);
        const fn = new AsyncFunction("kori", "console", "React", "__import", fnCode);
        result.value = await fn.call(context, kori, consoleInstance, React, __import);
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
