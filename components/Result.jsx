import React from "react";
import {createRoot} from "react-dom/client";
import classNames from "classnames";
import {renderIcon, XCircleIcon} from "@josemi-icons/react";
import {CONSOLE_LEVELS, VALUES_TYPES} from "../constants.js";
import {Value} from "./Value.jsx";
import {isDOMElement, isReactElement, isMapCoordinate} from "../utils.js";

// Console levels info
const consoleLevels = {
    [CONSOLE_LEVELS.LOG]: {
        className: "text-gray-600",
        icon: "info-circle",
    },
    [CONSOLE_LEVELS.INFO]: {
        className: "text-blue-400",
        icon: "info-circle",
    },
    [CONSOLE_LEVELS.WARNING]: {
        className: "text-yellow-500",
        icon: "exclamation-triangle",
    },
    [CONSOLE_LEVELS.ERROR]: {
        className: "text-red-400",
        icon: "exclamation-circle",
    },
};

// Result types
const resultTypes = {
    [VALUES_TYPES.OBJECT]: {
        className: "bg-orange-700 text-white",
        icon: "braces",
    },
    [VALUES_TYPES.ARRAY]: {
        className: "bg-orange-400 text-white",
        icon: "brackets",
    },
    [VALUES_TYPES.COORDINATES]: {
        className: "bg-red-400 text-white",
        icon: "location",
    },
    [VALUES_TYPES.REACT]: {
        className: "bg-blue-300 text-white",
        icon: "atom",
    },
    [VALUES_TYPES.HTML]: {
        className: "bg-blue-600 text-white",
        icon: "code",
    },
    [VALUES_TYPES.STRING]: {
        className: "bg-green-400 text-white",
        icon: "text-left",
    },
    [VALUES_TYPES.FUNCTION]: {
        className: "bg-blue-700 text-white",
        icon: "function-square",
    },
    [VALUES_TYPES.BOOLEAN]: {
        className: "bg-indigo-600 text-white",
        icon: "toggle-right",
    },
    [VALUES_TYPES.NUMBER]: {
        className: "bg-yellow-600 text-white",
        icon: "plus",
    },
};

// Get result type
const getResultType = value => {
    if (isReactElement(value)) {
        return VALUES_TYPES.REACT;
    }
    else if (isDOMElement(value)) {
        return VALUES_TYPES.HTML;
    }
    else if (typeof value === "object") {
        if (!!value && Array.isArray(value)) {
            return VALUES_TYPES.ARRAY;
        }
        else if (isMapCoordinate(value)) {
            return VALUES_TYPES.COORDINATES;
        }
        // Other case, is a plain object
        return VALUES_TYPES.OBJECT;
    }
    // Other case, return the type
    return typeof value;
};

// Render a pill icons
const ResultIcon = props => {
    const {className, icon} = (resultTypes[props.type] || resultTypes[VALUES_TYPES.OBJECT]);
    return (
        <div className={`${className} flex items-start rounded-md p-1 mt-3 mr-2`}>
            <div className="flex text-sm">
                {renderIcon(icon)}
            </div>
        </div>
    );
};

// Print logs messages
const Logs = props => {
    return props.items.map((item, index) => {
        const {className, icon} = consoleLevels[item.level];
        return (
            <div key={`log-${index}`} className="flex gap-0">
                <div className="flex justify-end items-start w-12">
                    <div className={`${className} flex text-lg p-2`}>
                        {renderIcon(icon)}
                    </div>
                </div>
                <div className="editable-console px-3 py-2 rounded-md w-full grow">
                    <div className="text-sm">{item.message}</div>
                </div>
            </div>
        );
    });
};

const ErrorMessage = props => (
    <div className="flex w-full flex-nowrap">
        <div className="flex items-start justify-end w-12">
            <div className="flex p-2 text-red-500 text-lg">
                <XCircleIcon />
            </div>
        </div>
        <div className="gap-4 px-3 py-2 bg-red-100 rounded-md w-full">
            <pre className="block text-sm text-red-900">
                <b>{props.type}</b> {props.message}
            </pre>
        </div>
    </div>
);

export const Result = props => {
    const container = React.useRef(null);
    const root = React.useRef(null);
    const type = getResultType(props.value);
    const isCoordinatesValue = type === VALUES_TYPES.COORDINATES;
    const isHtmlValue = type === VALUES_TYPES.REACT || type === VALUES_TYPES.HTML;
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
                <ErrorMessage type={props.errorType} message={props.errorMessage} />
            )}
            {!props.error && (
                <React.Fragment>
                    <Logs items={props.logs || []} />
                    {/* Wrapper element for displaying result value */}
                    <div className="flex gap-0">
                        <div className="flex justify-end items-start w-12">
                            <ResultIcon type={type} />
                        </div>
                        <div className="editable-result flex grow rounded-md p-3 w-full">
                            <Value value={props.value} />
                        </div>
                    </div>
                    {isHtmlValue && (
                        <div className="ml-12 mt-1 bg-white">
                            <div ref={container} className="p-2 border border-gray-300 rounded-md" />
                        </div>
                    )}
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
