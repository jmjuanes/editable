import React from "react";
import {CodeInput} from "./CodeInput.jsx";
import {Result} from "./Result.jsx";
import * as runner from "../runner.js";

export const CodeBlock = props => {
    const [state, setState] = React.useState({
        value: props.initialValue,
        runIndex: 0,
    });
    // Handle run of this code block
    const handleRun = value => {
        setState(prevState => ({
            value: value,
            runIndex: prevState.runIndex,
            running: true,
        }));
        // Execute runner
        return runner.execute(value)
            .then(response => {
                props.onUpdate(value);
                setState(prevState => ({
                    value: value,
                    runIndex: prevState.runIndex + 1,
                    result: {
                        value: response,
                    },
                }));
            })
            .catch(error => {
                console.error(error);
                setState(prevState => ({
                    value: value,
                    runIndex: prevState.runIndex + 1,
                    error: true,
                    errorMessage: error.message,
                }));
            });
    };

    return (
        <div className="mb-4">
            <CodeInput
                key={`input:${props.id}:${state.runIndex}`}
                initialValue={state.value}
                disabled={!!state.running}
                onRun={handleRun}
            />
            {!state.running && state.result && (
                <Result
                    key={`result:${props.id}:${state.runIndex}`}
                    result={state.result}
                />
            )}
        </div>
    );
};

CodeBlock.defaultProps = {
    id: "",
    initialValue: "",
    onUpdate: null,
    onDelete: null,
};
