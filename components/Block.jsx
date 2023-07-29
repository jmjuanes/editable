import React from "react";
import {BLOCK_TYPES, LANGUAGES} from "../constants.js";
import {Editor} from "./Editor.jsx";
import * as runner from "../runner.js";

export const Block = props => {
    const value = React.useRef(props.value || "");
    const preview = React.useRef(null);
    const [state, setState] = React.useState({});
    // Handle run of this code block
    const handleRun = value => {
        setState(prevState => ({
            running: true,
        }));
        // Execute runner
        return runner.execute(value.current, preview.current)
            .then(response => {
                props.onUpdate(value.current);
                setState(prevState => ({
                    result: response,
                }));
            })
            .catch(error => {
                console.error(error);
                setState(prevState => ({
                    error: true,
                    errorMessage: error.message,
                }));
            });
    };

    return (
        <div className="mb-4">
            {props.type === BLOCK_TYPES.TEXT && (
                <React.Fragment>
                    {props.editing && (
                        <Editor
                            value={value.current}
                            language={LANGUAGES.MARKDOWN}
                            onChange={newValue => {
                                value.current = newValue;
                            }}
                        />
                    )}
                    {!props.editing && (
                        <div className="">Result</div>
                    )}
                </React.Fragment>
            )}
            {props.type === BLOCK_TYPES.CODE && (
                <React.Fragment>
                    <Editor
                        key={`editor:${props.id}:${props.editing}`}
                        value={value.current}
                        language={LANGUAGES.JAVASCRIPT}
                        readOnly={!props.editing}
                        onChange={newValue => {
                            value.current = newValue;
                        }}
                    />
                    {!state.running && state.result && (
                        <Result
                            key={`result:${props.id}:${state.runIndex}`}
                            result={state.result}
                        />
                    )}
                    <div ref={preview} />
                </React.Fragment>
            )}
        </div>
    );
};

Block.defaultProps = {
    id: "",
    type: BLOCK_TYPES.CODE,
    value: "",
    editing: false,
    onUpdate: null,
    onDelete: null,
};
