import React from "react";
import {BLOCK_TYPES} from "../constants.js";
import {CodeBlock} from "./CodeBlock.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";

export const Layout = () => {
    const notebook = useNotebook();

    return (
        <div className="w-full maxw-5xl mx-auto">
            {notebook.blocks.map(block => (
                <React.Fragment key={block.id}>
                    {block.type === BLOCK_TYPES.CODE && (
                        <CodeBlock
                            key={"block:" + block.id}
                            id={block.id}
                            initialValue={block.value}
                            onUpdate={newValue => {
                                notebook.updateBlock(block.id, {
                                    value: newValue,
                                });
                            }}
                            onDelete={() => {
                                notebook.deleteBlock(block.id);
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
