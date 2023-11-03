import React from "react";
import {Cell} from "./Cell.jsx";
import {CellInsert} from "./CellInsert.jsx";
import {NotebookHeader} from "./NotebookHeader.jsx";
import {NotebookMetadata} from "./NotebookMetadata.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";
import {exportNotebookToFile, saveNotebookAsYaml} from "../notebook.js";
import {stopEventPropagation} from "../utils.js";

export const Notebook = props => {
    const notebook = useNotebook();
    const [editingCell, setEditingCell] = React.useState("");
    const [metadataVisible, setMetadataVisible] = React.useState(false);
    return (
        <div className="flex flex-col w-full" onClick={() => setEditingCell("")}>
            <NotebookHeader
                title={notebook.data.title}
                author={notebook.data.author}
                tags={notebook.data.tags}
                deleteDisabled={!notebook.id}
                exportDisabled={false}
                onTitleChange={newTitle => {
                    notebook.setTitle(newTitle);
                }}
                onSave={() => {
                    saveNotebookAsYaml(notebook.data)
                        .then(() => console.log("File saved"))
                        .catch(error => console.error(error));
                }}
                onExport={() => {
                    exportNotebookToFile(notebook.data)
                        .then(() => console.log("File saved"))
                        .catch(error => console.error(error));
                }}
                onEditMetadata={() => setMetadataVisible(true)}
            />
            {props.showInsertCell && (
                <CellInsert
                    showInsertCode={true}
                    showInsertText={true}
                    onInsert={cellType => {
                        notebook.insertCellBefore(notebook.data.cells[0].id, cellType);
                    }}
                />
            )}
            {notebook.data.cells.map(cell => (
                <div key={cell.id} className="" onClick={stopEventPropagation}>
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
                    {props.showInsertCell && (
                        <CellInsert
                            showInsertCode={true}
                            showInsertText={true}
                            onInsert={cellType => {
                                notebook.insertCellAfter(cell.id, cellType);
                            }}
                        />
                    )}
                </div>
            ))}
            {metadataVisible && (
                <NotebookMetadata
                    author={notebook.data.author}
                    tags={notebook.data.tags}
                    onClose={() => setMetadataVisible(false)}
                    onSubmit={data => {
                        notebook.update(data);
                        setMetadataVisible(false);
                    }}
                />
            )}
        </div>
    );
};

Notebook.defaultProps = {
    showInsertCell: true,
};
