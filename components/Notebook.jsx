import React from "react";
import {Cell} from "./Cell.jsx";
import {InsertCell} from "./InsertCell.jsx";
import {NotebookHeader} from "./NotebookHeader.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";
import {stopEventPropagation} from "../utils.js";

export const Notebook = () => {
    const notebook = useNotebook();
    const showInsertCell = true;
    return (
        <div className="w-full" onClick={() => notebook.setEditingCell("")}>
            <NotebookHeader
                title={notebook.state.title}
                updatedAt={notebook.state.updatedAt}
                onTitleChange={newTitle => {
                    notebook.setTitle(newTitle);
                }}
            />
            {notebook.state.cells.map(cell => (
                <React.Fragment key={cell.id}>
                    <div className="" onClick={stopEventPropagation}>
                        <Cell
                            key={"cell:" + cell.id}
                            id={cell.id}
                            type={cell.type}
                            value={cell.value}
                            editing={cell.id === notebook.state.editingCell}
                            showDeleteButton={notebook.state.cells.length > 1}
                            onUpdate={value => {
                                notebook.updateCell(cell.id, {
                                    value: value,
                                });
                            }}
                            onDelete={() => {
                                notebook.deleteCell(cell.id);
                            }}
                            onEditStart={() => {
                                notebook.setEditingCell(cell.id);
                            }}
                            onEditEnd={() => {
                                notebook.setEditingCell("");
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
