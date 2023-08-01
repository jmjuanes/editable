import {RESULT_TYPES, CONSOLE_LEVELS} from "./constants.js";

const AsyncFunction = Object.getPrototypeOf(async function (){}).constructor;

// Global context for executing code blocks
let context = {};

// Wrap command for using 'await'
const wrapCommand = command => {
    return `return (async () => {${command}})();`;
};

// Create a new kori instance object
const createKoriInstance = () => {
    const koriInstance = {
        _parent: document.createElement("div"),
        _renderedHtml: false,
        delay: time => {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        renderHTML: html => {
            if (typeof html === "string") {
                koriInstance._parent.innerHTML = html;
                koriInstance._renderedHtml = true;
            }
        },
    };
    return koriInstance;
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
export const execute = async command => {
    const kori = createKoriInstance();
    const consoleInstance = createConsoleInstance();
    const result = {
        type: RESULT_TYPES.VALUE,
        logs: consoleInstance._logs,
    };
    try {
        const fn = new AsyncFunction("kori", "console", wrapCommand(command));
        result.value = await fn.call(context, kori, consoleInstance);
        // Check if we have rendered HTML content
        if (kori._renderedHtml) {
            result.type = RESULT_TYPES.HTML;
            result.html = kori._parent;
        }
    }
    catch(error) {
        // Save error message in result and set as error type
        result.type = RESULT_TYPES.ERROR;
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
