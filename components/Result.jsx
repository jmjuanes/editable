import React from "react";
import {createRoot} from "react-dom/client";
import classNames from "classnames";
import {renderIcon, XCircleIcon} from "@josemi-icons/react";
import {CONSOLE_LEVELS} from "../constants.js";
import {Value} from "./Value.jsx";
import {isDOMElement, isReactElement} from "../utils.js";

// Map icons by log level
const IconsByConsoleLevel = {
    [CONSOLE_LEVELS.LOG]: "info-circle",
    [CONSOLE_LEVELS.INFO]: "info-circle",
    [CONSOLE_LEVELS.WARNING]: "exclamation-triangle",
    [CONSOLE_LEVELS.ERROR]: "exclamation-circle",
};

// Print logs messages
const Logs = props => {
    return props.items.map((item, index) => {
        const classList = classNames({
            "flex gap-3 p-2 rounded-md bg-gray-100": true,
            "text-blue-600": item.level === CONSOLE_LEVELS.INFO,
            "text-yellow-700": item.level === CONSOLE_LEVELS.WARNING,
            "text-red-600": item.level === CONSOLE_LEVELS.ERROR,
        });
        return (
            <div key={`log-${index}`} className={classList}>
                <div className="flex items-center gap-1">
                    {renderIcon(IconsByConsoleLevel[item.level])}
                </div>
                <div className="text-sm">{item.message}</div>
            </div>
        );
    });
};

export const Result = props => {
    const container = React.useRef(null);
    const root = React.useRef(null);
    const isHtmlValue = isDOMElement(props.value) || isReactElement(props.value);
    const classList = classNames({
        "flex flex-col gap-2": true,
        "o-50": !props.isCurrentValue,
    });

    // Effect for mounting rendered HTML content into container
    React.useEffect(() => {
        if (!props.error && isHtmlValue) {
            if (isDOMElement(props.value)) {
                // Just append DOM element into container
                container.current.appendChild(props.value);
            }
            else {
                // Other case, value is a REACT element, so re will automatically render it
                root.current = createRoot(container.current);
                root.current.render(props.value);
                // Register unmount listener: unmount returned value when
                // this component is unmounted
                return () => {
                    root.current.unmount();
                };
            }
        }
    }, []);

    return (
        <div className={classList}>
            {props.error && (
                <div className="flex gap-4 p-3 bg-red-100 rounded-md">
                    <div className="flex items-center text-red-900 text-lg">
                        <XCircleIcon />
                    </div>
                    <div className="text-sm text-red-900">
                        <b>{props.errorType}</b>: {props.errorMessage}
                    </div>
                </div>
            )}
            {!props.error && (
                <React.Fragment>
                    <Logs items={props.logs || []} />
                    {/* Wrapper element for displaying result value */}
                    <div ref={container} className="border border-gray-300 rounded-md p-3 bg-white">
                        {!isHtmlValue && (
                            <Value value={props.value} />
                        )}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

Result.defaultProps = {
    value: null,
    isCurrentValue: true,
    error: false,
    errorType: null,
    errorMessage: null,
};
