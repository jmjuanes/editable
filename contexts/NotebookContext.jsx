import React from "react";
import {uid} from "uid/secure";

// Notebook context object
const NotebookContext = React.createContext({});

// Create a new block element
const createNewBlock = () => ({
    id: uid(20),
    value: "",
    result: null,
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
        updateBlock: (id, newBlock) => {
            notebook.setState({
                blocks: notebook.currentState.blocks.map(block => {
                    return block.id === id ? ({...block, ...newBlock}) : block;
                }),
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
