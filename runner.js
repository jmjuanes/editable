// Global container variable to store the iframe
let container = null;

// Initialize runner instance
export const initialize = () => {
    container = document.createElement("iframe");
    container.setAttribute("width", "1px");
    container.setAttribute("height", "1px");
    container.setAttribute("sandbox", "allow-scripts allow-same-origin");
    container.style.border = "0";
    container.style.display = "none";
    // Mount container
    document.body.appendChild(container);
};

// Execute the provide command
export const execute = command => {
    return new Promise((resolve, reject) => {
        let result = null;
        try {
            result = container.contentWindow.eval(`(${command})`);
        }
        catch (error) {
            return reject(error);
        }
        // Emit resolve with the result value
        return resolve(result);
    });
};

// Destroy runner
export const destroy = () => {
    return null;
};
