import React from "react";
import classNames from "classnames";
import {sanitize} from "dompurify";
import {marked} from "marked";

// Tiny wrapper for rendering and sanitize markdown
const renderMarkdonw = value => {
    return sanitize(marked.parse(value));
};

export const Markdown = props => {
    // Get markdown content of the provided value
    const content = React.useMemo(() => renderMarkdonw(props.value), [props.value]);
    const classList = classNames("editable-markdown", props.className);
    return (
        <div
            className={classList}
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
};

Markdown.defaultProps = {
    value: "",
    className: "",
};
