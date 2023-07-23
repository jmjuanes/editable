import React from "react";
import {uid} from "uid/secure";
import {BLOCK_TYPES} from "../constants.js";

// Notebook context object
const NotebookContext = React.createContext({});

// Create a new block element
const createNewBlock = type => ({
    id: uid(20),
    type: type || BLOCK_TYPES.CODE,
    value: "",
});

// Use notebook hook
export const useNotebook = () => {
    const notebook = React.useContext(NotebookContext);

    // Export public notebook api
    return {
        title: notebook.currentState.title,
        blocks: notebook.currentState.blocks,
        updateTitle: newTitle => {
            notebook.setState({title: newTitle});
        },
        updateBlock: (id, newData) => {
            const blocks = notebook.currentState.blocks;
            const updatedBlocks = blocks.map(block => {
                return block.id === id ? ({...block, ...newData}) : block;
            });
            // Check if we have updated the last block for creating a new
            // empty block automatically
            const index = blocks.findIndex(block => block.id === id);
            if (index === blocks.length - 1) {
                updatedBlocks.push(createNewBlock());
            }
            // Save state
            notebook.setState({
                blocks: updatedBlocks,
                updatedAt: Date.now(),
            });
        },
        deleteBlock: id => {
            const blocks = notebook.currentState.blocks;
            notebook.setState({
                blocks: blocks.filter(block => block.id !== id),
                updatedAt: Date.now(),
            });
        },
    };
};

// Notebook provider component
export const NotebookProvider = props => {
    const [state, setState] = React.useState({
        title: "Untitled",
        blocks: [
            createNewBlock(),
        ],
    });
    const contextValue = {
        listeners: props.listeners,
        currentState: state,
        setState: newState => {
            setState(prevState => ({...prevState, ...newState}));
        },
    };

    return (
        <NotebookContext.Provider value={contextValue}>
            {props.children}
        </NotebookContext.Provider>
    );
};
