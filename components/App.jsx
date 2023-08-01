import React from "react";

import {Block} from "./Block.jsx";
import {BlockHeader} from "./BlockHeader.jsx";
import {Title} from "./Title.jsx";
import {NotebookProvider, useNotebook} from "../contexts/NotebookContext.jsx";

import {stopEventPropagation} from "../utils.js";

// Inner app wrapper
const InnerApp = () => {
    const notebook = useNotebook();

    return (
        <div className="w-full" onClick={() => notebook.setEditingBlock("")}>
            <div className="w-full maxw-5xl mx-auto">
                <Title
                    value={notebook.state.title}
                    onChange={newTitle => {
                        notebook.setTitle(newTitle);
                    }}
                />
                {notebook.state.blocks.map(block => (
                    <div key={block.id} onClick={stopEventPropagation}>
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
                            onEditStart={() => {
                                notebook.setEditingBlock(block.id);
                            }}
                            onEditEnd={() => {
                                notebook.setEditingBlock("");
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const App = () => {
    return (
        <NotebookProvider>
            <InnerApp />
        </NotebookProvider>
    );
};
