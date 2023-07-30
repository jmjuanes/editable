import React from "react";
import {Block} from "./Block.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";

export const Layout = () => {
    const notebook = useNotebook();

    return (
        <div className="w-full maxw-5xl mx-auto">
            {notebook.state.blocks.map(block => (
                <React.Fragment key={block.id}>
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
                        onDelete={() => {
                            notebook.deleteBlock(block.id);
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
