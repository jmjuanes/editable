import React from "react";

import {KEYS} from "../constants.js";

export const CodeInput = props => {
    const input = React.useRef(null);
    const executed = React.useRef(false);
    const handleKeyDown = event => {
        const value = input.current.value || "";
        if (value && !executed.current) {
            // Handle ENTER + ShiftKey --> execute submit event
            if (event.key === KEYS.ENTER) {
                if (event.shiftKey && typeof props.onRun === "function") {
                    event.preventDefault();
                    executed.current = true;
                    return props.onRun(value);
                }
            }
        }
    };
    return (
        <div className="">
            <textarea
                ref={input}
                className="w-full rounded-none border border-gray-300 font-mono text-sm outline-0"
                defaultValue={props.initialValue}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

CodeInput.defaultProps = {
    initialValue: "",
    onRun: null,
};
