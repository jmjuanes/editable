import React from "react";
import {Cell} from "./Cell.jsx";
import {InsertCell} from "./InsertCell.jsx";
import {NotebookHeader} from "./NotebookHeader.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";
import {saveNotebookAsMarkdownFile} from "../notebook.js";
import {stopEventPropagation} from "../utils.js";

export const Notebook = () => {
    const notebook = useNotebook();
    const [editingCell, setEditingCell] = React.useState("");
    const showInsertCell = true;
    return (
        <div className="w-full" onClick={() => setEditingCell("")}>
            <NotebookHeader
                title={notebook.data.title}
                updatedAt={notebook.data.updatedAt}
                deleteDisabled={!notebook.id}
                exportDisabled={false}
                onTitleChange={newTitle => {
                    notebook.setTitle(newTitle);
                }}
                onExportNotebook={() => {
                    saveNotebookAsMarkdownFile(notebook.data)
                        .catch(error => console.error(error));
                }}
            />
            {notebook.data.cells.map(cell => (
                <React.Fragment key={cell.id}>
                    <div className="" onClick={stopEventPropagation}>
                        <Cell
                            key={"cell:" + cell.id}
                            id={cell.id}
                            type={cell.type}
                            value={cell.value}
                            editing={cell.id === editingCell}
                            showDeleteButton={notebook.data.cells.length > 1}
                            onUpdate={value => {
                                notebook.updateCell(cell.id, {
                                    value: value,
                                });
                            }}
                            onDelete={() => {
                                notebook.deleteCell(cell.id);
                            }}
                            onEditStart={() => {
                                setEditingCell(cell.id);
                            }}
                            onEditEnd={() => {
                                setEditingCell("");
                            }}
                        />
                    </div>
                    {showInsertCell && (
                        <div className="pl-12 mb-2">
                            <InsertCell
                                onInsert={type => {
                                    return notebook.insertCellAfter(cell.id, type);
                                }}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
