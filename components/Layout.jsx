import React from "react";

import {Input} from "./Input.jsx";
import {Result} from "./Result.jsx";
import {useNotebook} from "../contexts/NotebookContext.jsx";

import * as runner from "../runner.js";

export const Layout = () => {
    const notebook = useNotebook();

    // Handle submit
    const handleSubmit = (id, value) => {
        if (!value) {
            return;
        }
        // Execute run
        runner.execute(value)
            .then(result => {
                notebook.updateBlock(id, {
                    value: value,
                    result: {
                        date: Date.now(),
                        value: result,
                    },
                });
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className="">
            {notebook.blocks.map(block => (
                <div key={block.id}>
                    <Input
                        key={block.id}
                        ref={inputRef}
                        initialValue={block.value}
                        onSubmit={handleSubmit}
                    />
                    {block.result && (
                        <Result
                            key={block.id}
                            result={block.result}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
