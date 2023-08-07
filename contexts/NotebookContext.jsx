import React from "react";
import {uid} from "uid/secure";
import {CELL_TYPES} from "../constants.js";

// Notebook context object
const NotebookContext = React.createContext({});

// Create a new cell element
const createCell = (type, initialValue = "") => ({
    id: uid(20),
    type: type || CELL_TYPES.CODE,
    value: initialValue || "",
    locked: false,
});

// Use notebook hook
export const useNotebook = () => {
    const notebook = React.useContext(NotebookContext);

    return {
        context: notebook.context,
        state: notebook.state,
        setEditingCell: id => {
            notebook.setState({editingCell: id});
        },
        setTitle: newTitle => {
            notebook.setState({title: newTitle});
        },
        updateCell: (id, newData) => {
            const cells = notebook.state.cells;
            const updatedCells = cells.map(cell => {
                return cell.id === id ? ({...cell, ...newData}) : cell;
            });
            // Check if we have updated the last block for creating a new
            // empty block automatically
            // const index = blocks.findIndex(block => block.id === id);
            // if (index === blocks.length - 1) {
            //     updatedBlocks.push(createNewBlock());
            // }
            // Save state
            notebook.setState({
                cells: updatedCells,
                updatedAt: Date.now(),
            });
        },
        deleteCell: id => {
            const cells = notebook.state.cells;
            notebook.setState({
                cells: cells.filter(cell => cell.id !== id),
                updatedAt: Date.now(),
            });
        },
        insertCellAfter: (id, type) => {
            const cells = [...notebook.state.cells];
            const newCell = createCell(type);
            const index = cells.findIndex(cell => cell.id === id);
            // Insert this new cell after the current block
            (index === cells.length - 1) ? cells.push(newCell) : cells.splice(index + 1, 0, newCell);
            return notebook.setState({
                cells: cells,
                updatedAt: Date.now(),
            });
        },
        inserCellBefore: (id, type) => {
            // TODO
        },
    };
};

// Notebook provider component
export const NotebookProvider = props => {
    const context = React.useRef({});
    const [state, setState] = React.useState(() => ({
        title: "untitled",
        cells: [
            createCell(CELL_TYPES.TEXT),
            createCell(CELL_TYPES.CODE, `return "Hello world!";`),
        ],
        updatedAt: Date.now(),
        editingCell: "",
    }));
    const contextValue = {
        listeners: props.listeners,
        context: context.current,
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
