import React from "react";

// Delay the execution of the provided function
export const delay = (ms, callback) => window.setTimeout(callback, ms);

// Stop event propagation
export const stopEventPropagation = event => {
    event.stopPropagation();
};

// Check if the provided value is a valid map position
export const isMapLocation = value => {
    if (typeof value === "object" && Object.keys(value).length === 2) {
        return typeof value.latitude === "number" && typeof value.longitude === "number";
    }
    return false;
};

// Check if the provided value is a DOM element
export const isDOMElement = element => {
    return !!element && (element instanceof Element || element instanceof HTMLDocument);
};

export const getDOMElementName = element => {
    return `<${element.tagName.toLowerCase()} />`;
};

// Check if the provided value is a React Element
export const isReactElement = element => {
    return !!element && React.isValidElement(element);
};

export const getReactElementName = element => {
    return `<${element.displayName || "Unknown"} />`;
};

// Copy text to clipboard
export const copyTextToClipboard = text => {
    if (navigator?.clipboard) {
        return navigator.clipboard.writeText(text);
    }
    // TODO: use an alternate method to copy to clipboard
    return Promise.reject(null);
};
