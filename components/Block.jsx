import React from "react";
import {BLOCK_TYPES, LANGUAGES} from "../constants.js";
import {Editor} from "./Editor.jsx";
import {Result} from "./Result.jsx";
import * as runner from "../runner.js";

export const Block = props => {
    const value = React.useRef(props.value || "");
    const [state, setState] = React.useState({});
    // Effect on editing prop. When changed, chedk if current value is different
    React.useEffect(
        () => {
            if (!props.editing && props.value !== value.current) {
                props.onUpdate(value.current);
            }
        },
        [props.editing],
    );
    // Handle block click --> set as editing
    const handleClick = event => {
        if (!props.editing) {
            event.preventDefault();
            props.onEdit();
        }
    };
    // Handle run of this code block
    const handleRun = async () => {
        setState(() => ({
            running: true,
        }));
        // Execute code block
        const result = await runner.execute(value.current);
        // Uppdate current value and save result response
        // TODO: end editing this code block
        props.onUpdate(value.current);
        setState(() => ({
            running: false,
            result: result,
        }));
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
                        <div className="w-full pl-12">
                            Result
                        </div>
                    )}
                </React.Fragment>
            )}
            {props.type === BLOCK_TYPES.CODE && (
                <React.Fragment>
                    <div onClick={handleClick}>
                        <Editor
                            key={`editor:${props.id}:${props.editing}`}
                            value={value.current}
                            language={LANGUAGES.JAVASCRIPT}
                            readOnly={!props.editing}
                            showSubmitHint={true}
                            showSubmitButton={true}
                            onChange={newValue => {
                                value.current = newValue;
                            }}
                            onSubmit={handleRun}
                        />
                    </div>
                    {!state.running && state.result && (
                        <div className="w-full pl-12 mt-3">
                            <Result {...state.result} />
                        </div>
                    )}
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
    onEdit: null,
};
