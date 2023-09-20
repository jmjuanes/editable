import React from "react";

const isSerializable = value => {
    return typeof value === "object" || typeof value === "boolean";
};

// Get data from storage
const get = (store, key, defaultValue) => {
    if (isSerializable(defaultValue)) {
        return JSON.parse(store.getItem(key)) || defaultValue;
    }
    // Just return the value
    return store.getItem(key) ?? defaultValue;
};

// Set data in the store
const set = (store, key, value) => {
    store.setItem(key, isSerializable(value) ? JSON.stringify(value) : value);
};

// General hook
const useStore = (store, key, defaultValue) => {
    const [state, setState] = React.useState(() => {
        return get(store, key, defaultValue);
    });
    // Internal hook to save the value in the store
    React.useEffect(() => {
        set(store, key, state);
    }, [state]);
    // Return current value and setter
    return [state, setState];
};

// Use local storage hook
export const useLocalStorage = (key, defaultValue) => {
    return useStore(window.localStorage, key, defaultValue);
};

// Use session storage hook
export const useSessionStorage = (key, defaultValue) => {
    return useStore(window.sessionStorage, key, defaultValue);
};
