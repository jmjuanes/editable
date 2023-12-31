import React from "react";
import {importNotebook} from "../notebook.js";
import {createNotebookCell, createNotebookContext} from "../notebook.js";
import {useSessionStorage} from "../hooks/useStorage.js";

// Notebook context object
const NotebookContext = React.createContext({});

// Use notebook hook
export const useNotebook = () => {
    const notebook = React.useContext(NotebookContext);
    const insertCell = (id, type, initialValue) => {
        const cells = [...notebook.state.cells];
        const newCell = createNotebookCell(type, initialValue);
        const index = cells.findIndex(cell => cell.id === id);
        // Insert this new cell after the current block
        (index === cells.length - 1) ? cells.push(newCell) : cells.splice(index + 1, 0, newCell);
        return notebook.setState({
            cells: cells,
            updated_at: Date.now(),
        });
    };
    return {
        id: notebook.id,
        context: notebook.context,
        data: notebook.state,
        setTitle: newTitle => {
            notebook.setState({
                title: newTitle,
                updated_at: Date.now(),
            });
        },
        update: newData => {
            return notebook.setState({
                ...newData,
                updated_at: Date.now(),
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
                updated_at: Date.now(),
            });
        },
        deleteCell: id => {
            const cells = notebook.state.cells;
            notebook.setState({
                cells: cells.filter(cell => cell.id !== id),
                updated_at: Date.now(),
            });
        },
        duplicateCell: id => {
            const cell = notebook.state.cells.find(c => c.id === id);
            return insertCell(id, cell.type, cell.value);
        },
        insertCellAfter: (id, type) => {
            return insertCell(id, type, "");
        },
        insertCellBefore: (id, type) => {
            const cells = [...notebook.state.cells];
            const newCell = createNotebookCell(type);
            const index = cells.findIndex(cell => cell.id === id);
            // Insert this new cell before the current cell block
            (index === 0) ? cells.unshift(newCell) : cells.splice(index - 1, 0, newCell);
            return notebook.setState({
                cells: cells,
                updated_at: Date.now(),
            });
        },
    };
};

// Notebook provider component
export const NotebookProvider = props => {
    const [state, setState] = useSessionStorage("editable-data", null);
    const context = React.useRef(null);
    // Initialize notebook context
    if (!context.current) {
        context.current = createNotebookContext();
    }
    // Hook to import notebook data
    React.useEffect(() => {
        if (!state || !state.updated_at) {
            importNotebook()
                .then(notebookData => {
                    setState(notebookData);
                })
                .catch(error => {
                    console.error(error);
                })
        }
    }, []);
    // Hook to update notebook title
    React.useEffect(() => {
        if (state?.title) {
            document.title = `${state.title} | Editable`;
        }
    }, [state?.title]);
    // Check if we have notebook data
    if (state) {
        const contextValue = {
            id: state?.id || props.id || "",
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
