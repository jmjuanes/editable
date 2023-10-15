import React from "react";
import {createRoot} from "react-dom/client";
import classNames from "classnames";
import {renderIcon, ChevronDownIcon, ChevronRightIcon} from "@josemi-icons/react";
import {CONSOLE_LEVELS} from "../constants.js";
import {Value} from "./Value.jsx";
import {isDOMElement, isReactElement} from "../utils.js";

// Console levels info
const consoleLevels = {
    [CONSOLE_LEVELS.LOG]: {
        className: "bg-gray-200 text-gray-900",
        icon: "info-circle",
    },
    [CONSOLE_LEVELS.INFO]: {
        className: "bg-blue-200 text-gray-900",
        icon: "info-circle",
    },
    [CONSOLE_LEVELS.WARNING]: {
        className: "bg-yellow-200 text-gray-900",
        icon: "exclamation-triangle",
    },
    [CONSOLE_LEVELS.ERROR]: {
        className: "bg-red-200 text-gray-900",
        icon: "exclamation-circle",
    },
};

// Render a pill icons
const PillIcon = props => (
    <div className={`${props.className} flex items-start rounded-md p-1 mt-1 mr-2`}>
        <div className="flex text-lg">
            {renderIcon(props.icon)}
        </div>
    </div>
);

// Print logs messages
const Logs = props => {
    return props.items.map((item, index) => {
        const {className, icon} = consoleLevels[item.level];
        return (
            <div key={`log-${index}`} className="ml-12">
                <div className="editable-console px-3 py-2 rounded-md w-full grow">
                    <div className="text-sm">{item.message}</div>
                </div>
            </div>
        );
    });
};

export const Result = props => {
    const container = React.useRef(null);
    const root = React.useRef(null);
    const [compact, setCompact] = React.useState(false);
    const isHtmlValue = isDOMElement(props.value) || isReactElement(props.value);
    const classList = classNames({
        "flex flex-col gap-2": true,
        "o-50": !props.isCurrentValue,
    });
    // Toggle compact view
    const toggleCompact = () => {
        return setCompact(prevCompact => !prevCompact);
    };
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
                <div className="flex w-full flex-nowrap">
                    <div className="flex items-start justify-end w-12">
                        <div className="flex px-1 py-2 cursor-pointer" onClick={toggleCompact}>
                            <div className="flex">
                                {compact ? <ChevronRightIcon /> : <ChevronDownIcon />}
                            </div>
                        </div>
                    </div>
                    <div className="gap-4 px-3 py-2 bg-red-100 rounded-md w-full">
                        <pre className="block text-sm text-red-900">
                            <b>{props.errorType}</b> {compact ? null : props.errorMessage}
                        </pre>
                    </div>
                </div>
            )}
            {!props.error && (
                <React.Fragment>
                    <Logs items={props.logs || []} />
                    {/* Wrapper element for displaying result value */}
                    <div className="ml-12">
                        <div ref={container} className="editable-result rounded-md p-3 w-full">
                            {!isHtmlValue && (
                                <Value value={props.value} />
                            )}
                        </div>
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
