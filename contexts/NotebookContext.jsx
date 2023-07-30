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
        state: notebook.state,
        setEditingBlock: id => {
            notebook.setState({editingBlock: id});
        },
        setTitle: newTitle => {
            notebook.setState({title: newTitle});
        },
        updateBlock: (id, newData) => {
            const blocks = notebook.state.blocks;
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
            const blocks = notebook.state.blocks;
            notebook.setState({
                blocks: blocks.filter(block => block.id !== id),
                updatedAt: Date.now(),
            });
        },
        insertBlockAfter: (id, type) => {
            const blocks = [...notebook.state.blocks];
            const newBlock = createNewBlock(type);
            const index = blocks.findIndex(b => b.id === id);
            // Insert this new block after the current block
            (index === blocks.length - 1) ? blocks.push(newBlock) : blocks.slice(index + 1, 0, newBlock);
            return notebook.setState({
                blocks: blocks,
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
        editingBlock: "",
    });
    const contextValue = {
        listeners: props.listeners,
        state: state,
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
