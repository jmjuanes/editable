import React from "react";

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
