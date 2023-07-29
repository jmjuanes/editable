import React from "react";
import * as CodeCake from "codecake";

export const Editor = props => {
    const editor = React.useRef(null);
    React.useEffect(() => {
        // Initialize editor
        const cake = CodeCake.create(editor.current, {
            code: props.value,
            language: props.language,
            lineNumbers: true,
            readOnly: props.readOnly,
            highlight: CodeCake.highlight,
        });
        // Register code change
        cake.onChange(props.onChange);
    }, []);

    return (
        <div className="">
            <div ref={editor} className="w-full" />
        </div>
    );
};

Editor.defaultProps = {
    value: "",
    language: "",
    readOnly: false,
    onChange: null,
};
