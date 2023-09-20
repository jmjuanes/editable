import React from "react";
import {createNotebook} from "../notebook.js";
import {createNotebookCell, createNotebookContext} from "../notebook.js";
import {useLocalStorage, useSessionStorage} from "../hooks/useStorage.js";

// Notebook context object
const NotebookContext = React.createContext({});

// Use notebook hook
export const useNotebook = () => {
    const notebook = React.useContext(NotebookContext);
    return {
        id: notebook.id,
        context: notebook.context,
        data: notebook.state,
        setTitle: newTitle => {
            notebook.setState({
                title: newTitle,
                updatedAt: Date.now(),
            });
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
            const newCell = createNotebookCell(type);
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
    const [state, setState] = useSessionStorage("editable-data", null);
    const context = React.useRef(null);
    const lastUpdated = React.useRef(null);
    // Initialize notebook context
    if (!context.current) {
        context.current = createNotebookContext();
    }
    // Hook to import notebook data
    React.useEffect(() => {
        // Initialize a new empty notebook
        if (!state || !state.updatedAt) {
            setState(createNotebook());
        }
    }, []);
    // Check if we have notebook data
    if (state) {
        const contextValue = {
            id: props.id || null,
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
    }
    // Default: display a loading spinner
    return (
        <div align="center">Loading...</div>
    );
};
