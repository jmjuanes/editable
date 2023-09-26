import React from "react";
import {PlayIcon} from "@josemi-icons/react";
import * as CodeCake from "codecake";

const SubmitButton = ({onClick, text}) => (
    <div className="flex items-center gap-1 px-2 py-1 rounded text-white bg-green-500 hover:bg-green-600 cursor-pointer" onClick={onClick}>
        <div className="text-white flex items-center">
            <PlayIcon />
        </div>
        <div className="text-sm flex text-white">
            <strong>{text}</strong>
        </div>
    </div>
);

export const Editor = props => {
    const editor = React.useRef(null);
    React.useEffect(() => {
        const cake = CodeCake.create(editor.current, {
            code: props.value || "",
            className: "codecake-light editable-editor",
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
        // Autofocus on the editor element
        editor.current.querySelector(".codecake-editor").focus();
    }, []);

    return (
        <div className="">
            <div ref={editor} className="w-full" />
            {!props.readOnly && (props.showSubmitButton || props.showSubmitHint) && (
                <div className="flex flex-nowrap gap-4 items-center mt-2 pl-12">
                    {props.showSubmitButton && (
                        <SubmitButton
                            text={props.submitText}
                            onClick={props.onSubmit}
                        />
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
    submitHint: "Press 'Shift' + 'Enter' to execute this code cell.",
    submitText: "Execute",
    showSubmitButton: false,
    showSubmitHint: true,
    onChange: null,
    onSubmit: null,
};
