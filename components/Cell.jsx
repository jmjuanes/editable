import React from "react";
import {LoaderIcon} from "@josemi-icons/react";
import {CELL_TYPES, LANGUAGES} from "../constants.js";
import {Editor} from "./Editor.jsx";
import {Result} from "./Result.jsx";
import {Markdown} from "./Markdown.jsx";
import {CellHeader} from "./CellHeader.jsx";
import {executeNotebookCell} from "../notebook.js";
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
    const handleRun = () => {
        setState(() => ({
            running: true,
        }));
        executeNotebookCell(props.id, value.current, notebook.context)
            .then(result => {
                // Uppdate the current value and save result response
                props.onEditEnd();
                setState(() => ({
                    running: false,
                    result: result,
                    executedTime: Date.now(),
                    executedValue: value.current,
                }));
            });
    };

    return (
        <div className="mb-4">
            {props.showHeader && (
                <CellHeader
                    id={props.type === CELL_TYPES.CODE ? props.id : null}
                    showInsertButtons={props.showInsertButtons}
                    showDeleteButton={props.showDeleteButton}
                    showDuplicateButton={props.showDuplicateButton}
                    showExecuteButton={props.type === CELL_TYPES.CODE}
                    onDelete={props.onDelete}
                    onDuplicate={props.onDuplicate}
                    onInsert={props.onInsert}
                    onExecute={handleRun}
                />
            )}
            {props.type === CELL_TYPES.TEXT && (
                <React.Fragment>
                    {props.editing && (
                        <div style={{marginLeft:"-3rem"}}>
                            <Editor
                                value={value.current}
                                language={LANGUAGES.MARKDOWN}
                                submitHint="Press 'Shift' + 'Enter' to save."
                                onChange={newValue => {
                                    value.current = newValue;
                                }}
                                onSubmit={() => props.onEditEnd()}
                            />
                        </div>
                    )}
                    {!props.editing && (
                        <div className="w-full" onClick={handleClick}>
                            {!value.current && (
                                <span className="text-neutral-300">Type something...</span>
                            )}
                            {!!value.current && (
                                <Markdown value={value.current} />
                            )}
                        </div>
                    )}
                </React.Fragment>
            )}
            {props.type === CELL_TYPES.CODE && (
                <React.Fragment>
                    <div style={{marginLeft:"-3rem"}} onClick={handleClick}>
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
                            <div className="flex text-xl text-neutral-400 animation-spin">
                                <LoaderIcon />
                            </div>
                        </div>
                    )}
                    {!state.running && state.result && (
                        <div className="mt-3" style={{marginLeft:"-3rem"}}>
                            <Result
                                key={state.executedTime}
                                value={state.result?.value}
                                logs={state.result?.logs}
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
    showInsertButtons: true,
    showDeleteButton: true,
    showDuplicateButton: true,
    onUpdate: null,
    onDelete: null,
    onInsert: null,
    onDuplicate: null,
    onEditStart: null,
    onEditEnd: null,
};
