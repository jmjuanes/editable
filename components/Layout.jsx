import React from "react";
import {Block} from "./Block.jsx";
import {BlockHeader} from "./BlockHeader.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";

export const Layout = () => {
    const notebook = useNotebook();

    return (
        <div className="w-full maxw-5xl mx-auto">
            {notebook.state.blocks.map(block => (
                <React.Fragment key={block.id}>
                    <BlockHeader
                        showDeleteButton={notebook.state.blocks.length > 1}
                        showInsertButtons={true}
                        onInsert={type => {
                            return notebook.insertBlockAfter(block.id, type);
                        }}
                        onDelete={() => {
                            notebook.deleteBlock(block.id);
                        }}
                    />
                    <Block
                        key={"block:" + block.id}
                        id={block.id}
                        type={block.type}
                        value={block.value}
                        editing={block.id === notebook.state.editingBlock}
                        onUpdate={value => {
                            notebook.updateBlock(block.id, {
                                value: value,
                            });
                        }}
                        onEdit={() => {
                            notebook.setEditingBlock(block.id);
                        }}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};
