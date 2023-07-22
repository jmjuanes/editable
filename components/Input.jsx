import React from "react";

import {KEYS} from "../constants.js";

export const Input = props => {
    const input = React.useRef();
    const handleKeyDown = event => {
        const value = input.current.value || "";
        // Handle ENTER + ShiftKey --> execute submit event
        if (event.key === KEYS.ENTER) {
            if (event.shiftKey && value && typeof props.onRun === "function") {
                event.preventDefault();
                return props.onRun(value);
            }
        }
    };
    return (
        <div className="">
            <textarea
                ref={input}
                className="w-full"
                defaultValue={props.initialValue}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

Input.defaultProps = {
    initialValue: "",
    onRun: null,
};
