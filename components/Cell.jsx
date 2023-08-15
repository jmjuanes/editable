import React from "react";
import {LoaderIcon} from "@josemi-icons/react";
import {CELL_TYPES, LANGUAGES} from "../constants.js";
import {Editor} from "./Editor.jsx";
import {Result} from "./Result.jsx";
import {CellHeader} from "./CellHeader.jsx";
import {execute} from "../runner.js";
import {useNotebook} from "../contexts/NotebookContext.jsx";

export const Cell = props => {
    const notebook = useNotebook();
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
    // Handle cell click --> set as editing
    const handleClick = event => {
        if (!props.editing) {
            event.preventDefault();
            props.onEditStart();
        }
    };
    // Handle run of this code cell
    const handleRun = async () => {
        setState(() => ({
            running: true,
        }));
        const result = await execute(value.current, notebook.context);
        // Uppdate current value and save result response
        props.onEditEnd();
        setState(() => ({
            running: false,
            result: result,
            executedTime: Date.now(),
            executedValue: value.current,
        }));
    };

    return (
        <div className="mb-4">
            {props.showHeader && (
                <CellHeader
                    showDeleteButton={props.showDeleteButton}
                    onDelete={props.onDelete}
                />
            )}
            {props.type === CELL_TYPES.TEXT && (
                <React.Fragment>
                    {props.editing && (
                        <Editor
                            value={value.current}
                            language={LANGUAGES.MARKDOWN}
                            submitHint="Press 'Shift' + 'Enter' to save."
                            onChange={newValue => {
                                value.current = newValue;
                            }}
                            onSubmit={() => props.onEditEnd()}
                        />
                    )}
                    {!props.editing && (
                        <div className="w-full pl-12" onClick={handleClick}>
                            {!value.current && (
                                <span className="text-gray-500">Type something...</span>
                            )}
                            {!!value.current && (
                                <span>{value.current}</span>
                            )}
                        </div>
                    )}
                </React.Fragment>
            )}
            {props.type === CELL_TYPES.CODE && (
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
                    {state.running && (
                        <div className="flex flex-col items-center justify-center w-full p-8 select-none">
                            <div className="flex text-xl text-gray-400 animation-spin">
                                <LoaderIcon />
                            </div>
                        </div>
                    )}
                    {!state.running && state.result && (
                        <div className="w-full pl-12 mt-3">
                            <Result
                                key={state.executedTime}
                                value={state.result?.value}
                                isCurrentValue={!props.editing && value.current === state.executedValue}
                                error={!!state.result?.error}
                                errorType={state.result?.errorType}
                                errorMessage={state.result?.errorMessage}
                            />
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

Cell.defaultProps = {
    id: "",
    type: CELL_TYPES.CODE,
    value: "",
    editing: false,
    showHeader: true,
    showDeleteButton: true,
    onUpdate: null,
    onDelete: null,
    onEditStart: null,
    onEditEnd: null,
};