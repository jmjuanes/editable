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
    return (
        <div className="flex flex-col gap-2 w-full" onClick={() => setEditingCell("")}>
            <NotebookHeader
                title={notebook.data.title}
                updatedAt={notebook.data.updatedAt}
                deleteDisabled={!notebook.id}
                exportDisabled={false}
                onTitleChange={newTitle => {
                    notebook.setTitle(newTitle);
                }}
                onExport={() => {
                    saveNotebookAsMarkdownFile(notebook.data)
                        .catch(error => console.error(error));
                }}
            />
            <InsertCell
                onInsert={type => {
                    const firstCell = notebook.data.cells[0];
                    notebook.insertCellBefore(firstCell.id, type);
                }}
            />
            {notebook.data.cells.map(cell => (
                <div key={cell.id}>
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
                            onDuplicate={() => {
                                notebook.duplicateCell(cell.id);
                            }}
                            onEditStart={() => {
                                setEditingCell(cell.id);
                            }}
                            onEditEnd={() => {
                                setEditingCell("");
                            }}
                        />
                    </div>
                    <InsertCell
                        onInsert={type => {
                            return notebook.insertCellAfter(cell.id, type);
                        }}
                    />
                </div>
            ))}
        </div>
    );
};
