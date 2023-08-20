import {uid} from "uid/secure";
import {VERSION, CELL_TYPES} from "./constants.js";

// Create a new cell element
export const createNotebookCell = (type, initialValue = "") => {
    return {
        id: uid(20),
        type: type || CELL_TYPES.CODE,
        value: initialValue || "",
        locked: false,
    };
};

// Create a new notebook
export const createNotebook = () => {
    return {
        version: VERSION,
        title: "untitled",
        description: "",
        isFork: false,
        cells: [
            // createNotebookCell(CELL_TYPES.TEXT, ""),
            createNotebookCell(CELL_TYPES.CODE, `return "Hello world!";`),
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
};

// Export notebook as Markdown file
export const exportNotebook = notebook => {
    return null;
};

// Import notebook from markdown file
export const importNotebook = data => {
    return null;
};
