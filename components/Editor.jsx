import React from "react";
import {PlayIcon} from "@josemi-icons/react";
import * as CodeCake from "codecake";

export const Editor = props => {
    const editor = React.useRef(null);
    React.useEffect(() => {
        const cake = CodeCake.create(editor.current, {
            code: props.value || "",
            className: "codecake-light kori-editor",
            language: props.language,
            lineNumbers: true,
            readOnly: props.readOnly,
            highlight: CodeCake.highlight,
        });
        // Register event listeners
        cake.onChange(props.onChange);
        cake.onKeyDown(event => {
            if (event.shiftKey && event.key === "Enter") {
                event.preventDefault();
                props.onSubmit();
            }
        });
    }, []);

    return (
        <div className="">
            <div ref={editor} className="w-full" />
            {!props.readOnly && (props.showSubmitButton || props.showSubmitHint) && (
                <div className="flex flex-nowrap gap-4 items-center mt-2 pl-12">
                    {props.showSubmitButton && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-white bg-green-500 hover:bg-green-600" onClick={props.onSubmit}>
                            <div className="text-white flex items-center">
                                <PlayIcon />
                            </div>
                            <div className="text-sm flex text-white">
                                <strong>{props.submitText}</strong>
                            </div>
                        </div>
                    )}
                    {props.showSubmitHint && (
                        <div className="text-gray-400 text-sm">
                            {props.submitHint}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

Editor.defaultProps = {
    value: "",
    language: "",
    readOnly: false,
    submitHint: "Press 'Shift' + 'Enter' to execute this code block.",
    submitText: "Execute",
    showSubmitButton: false,
    showSubmitHint: true,
    onChange: null,
    onSubmit: null,
};
