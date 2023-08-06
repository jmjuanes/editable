import React from "react";
import {DataTable} from "@koridev/datatable";
import {CONSOLE_LEVELS} from "./constants.js";

const AsyncFunction = Object.getPrototypeOf(async function (){}).constructor;

// Global context for executing code blocks
let context = {};

// Create function code
const createFunctionCode = code => {
    return `return (async () => {${code}})();`;
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
export const execute = async code => {
    const kori = createKoriInstance();
    const consoleInstance = createConsoleInstance();
    const result = {
        logs: consoleInstance._logs,
        error: false,
    };
    try {
        const fnCode = createFunctionCode(code);
        const fn = new AsyncFunction("kori", "console", "React", fnCode);
        result.value = await fn.call(context, kori, consoleInstance, React);
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

// Reset context
export const resetContext = () => {
    context = {};
};
