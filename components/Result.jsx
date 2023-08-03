import React from "react";
import classNames from "classnames";
import {renderIcon, XCircleIcon} from "@josemi-icons/react";
import {RESULT_TYPES, CONSOLE_LEVELS} from "../constants.js";
import {Value} from "./Value.jsx";

// Map icons by log level
const IconsByConsoleLevel = {
    [CONSOLE_LEVELS.LOG]: "info-circle",
    [CONSOLE_LEVELS.INFO]: "info-circle",
    [CONSOLE_LEVELS.WARNING]: "exclamation-triangle",
    [CONSOLE_LEVELS.ERROR]: "exclamation-circle",
};

const ResultLog = props => {
    const classList = classNames({
        "flex gap-3 p-2 rounded-md bg-gray-100": true,
        "text-blue-600": props.level === CONSOLE_LEVELS.INFO,
        "text-yellow-700": props.level === CONSOLE_LEVELS.WARNING,
        "text-red-600": props.level === CONSOLE_LEVELS.ERROR,
    });
    return (
        <div className={classList}>
            <div className="flex items-center gap-1">
                {renderIcon(IconsByConsoleLevel[props.level])}
            </div>
            <div className="text-sm">{props.message}</div>
        </div>
    );
};

const ResultError = props => (
    <div className="flex gap-4 p-3 bg-red-100 rounded-md">
        <div className="flex items-center text-red-900 text-lg">
            <XCircleIcon />
        </div>
        <div className="text-sm text-red-900">
            <b>{props.type}</b>: {props.message}
        </div>
    </div>
);

export const Result = props => {
    const preview = React.useRef(null);
    const classList = classNames({
        "flex flex-col gap-2": true,
        "o-50": !props.current,
    });

    // Effect for mounting rendered HTML content into container
    React.useEffect(() => {
        // Append HTML content into preview container
        if (props.type === RESULT_TYPES.HTML && props.html) {
            preview.current.appendChild(props.html);
        }
    }, []);

    return (
        <div className={classList}>
            {props.type === RESULT_TYPES.ERROR && (
                <ResultError
                    type={props.errorType}
                    message={props.errorMessage}
                />
            )}
            {props.type !== RESULT_TYPES.ERROR && props.logs.map((item, index) => (
                <ResultLog
                    key={index}
                    level={item.level}
                    message={item.message}
                />
            ))}
            {(props.type === RESULT_TYPES.VALUE || props.type === RESULT_TYPES.HTML) && (
                <div ref={preview} className="border border-gray-300 rounded-md p-3 bg-white">
                    {props.type === RESULT_TYPES.VALUE && (
                        <Value value={props.value} />
                    )}
                </div>
            )}
        </div>
    );
};

Result.defaultProps = {
    current: true,
};
