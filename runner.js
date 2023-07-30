import {RESULT_TYPES} from "./constants.js";

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

// Global context for executing code blocks
let context = {};

// Create a new kori instance object
const createKoriInstance = () => {
    const koriInstance = {
        _logs: [],
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
        test: value => value + 5,
    };
    return koriInstance;
};

// Execute the provide command
export const execute = async command => {
    const kori = createKoriInstance();
    const result = {
        type: RESULT_TYPES.VALUE,
        logs: kori._logs,
    };
    try {
        const fn = new AsyncFunction("kori", command);
        result.value = await fn.call(context, kori);
        // Check if we have rendered HTML content
        if (kori._renderedHtml) {
            result.type = RESULT_TYPES.HTML;
            result.html = kori._parent;
        }
    }
    catch(error) {
        // Save error message in result and set as error type
        result.type = RESULT_TYPES.ERROR;
        result.errorMessage = error.message;
    }
    // Return result object
    return result;
};

// Reset context
export const resetContext = () => {
    context = {};
};
