const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

// Global context for executing code blocks
let context = {};

// Execute the provide command
export const execute = async (command, previewRef) => {
    try {
        const fn = new AsyncFunction(command);
        const result = await fn.call(context);
        return result;
    }
    catch(error) {
        return error;
    }
};

// Reset context
export const resetContext = () => {
    context = {};
};
