import React from "react";

// Delay the execution of the provided function
export const delay = (ms, callback) => window.setTimeout(callback, ms);

// Stop event propagation
export const stopEventPropagation = event => {
    event.stopPropagation();
};

// Check if the provided value is a DOM element
export const isDOMElement = element => {
    return !!element && (element instanceof Element || element instanceof HTMLDocument);
};

// Check if the provided value is a React Element
export const isReactElement = element => {
    return !!element && React.isValidElement(element);
};

// Copy text to clipboard
export const copyTextToClipboard = text => {
    if (navigator?.clipboard) {
        return navigator.clipboard.writeText(text);
    }
    // TODO: use an alternate method to copy to clipboard
    return Promise.reject(null);
};
