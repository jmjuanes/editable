import React from "react";
import {createRoot} from "react-dom/client";
import classNames from "classnames";
import {renderIcon, XCircleIcon} from "@josemi-icons/react";
import {CONSOLE_LEVELS} from "../constants.js";
import {Value} from "./Value.jsx";
import {isDOMElement, isReactElement} from "../utils.js";

// Console levels info
const consoleLevels = {
    [CONSOLE_LEVELS.LOG]: {
        className: "bg-blue-400",
        icon: "info-circle",
    },
    [CONSOLE_LEVELS.INFO]: {
        className: "bg-teal-400",
        icon: "info-circle",
    },
    [CONSOLE_LEVELS.WARNING]: {
        className: "bg-yellow-500",
        icon: "exclamation-triangle",
    },
    [CONSOLE_LEVELS.ERROR]: {
        className: "bg-red-400",
        icon: "exclamation-circle",
    },
};

// Print logs messages
const Logs = props => {
    return props.items.map((item, index) => {
        const {className, icon} = consoleLevels[item.level];
        return (
            <div key={`log-${index}`} className="flex items-center flex-nowrap">
                <div className="w-12 flex justify-end">
                    <div className={`${className} flex text-white rounded-md p-1 mr-2`}>
                        <div className="flex">{renderIcon(icon)}</div>
                    </div>
                </div>
                <div className="editable-console p-2 rounded-md w-full grow">
                    <div className="text-sm">{item.message}</div>
                </div>
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
