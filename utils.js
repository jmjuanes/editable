import React from "react";

// Delay the execution of the provided function
export const delay = (ms, callback) => window.setTimeout(callback, ms);

// Stop event propagation
export const stopEventPropagation = event => {
    event.stopPropagation();
};

// Check if the provided value is a valid map coordinate
export const isMapCoordinate = value => {
    if (typeof value === "object" && !!value && Object.keys(value).length === 2) {
        return typeof value.latitude !== "undefined" && typeof value.longitude !== "undefined";
    }
    return false;
};

// Check if the provided value is a DOM element
export const isDOMElement = element => {
    return !!element && (element instanceof Element || element instanceof HTMLDocument);
};

export const getDOMElementName = element => {
    return element.tagName.toLowerCase();
};

// Check if the provided value is a React Element
export const isReactElement = element => {
    return !!element && React.isValidElement(element);
};

export const getReactElementName = element => {
    if (typeof element.type === "string") {
        return element.type;
    }
    else if (typeof element.type === "function") {
        return element.type.name || element.type.displayName;
    }
    return "Unknown";
};

// Copy text to clipboard
export const copyTextToClipboard = text => {
    if (navigator?.clipboard) {
        return navigator.clipboard.writeText(text);
    }
    // TODO: use an alternate method to copy to clipboard
    return Promise.reject(null);
};
