import React from "react";
import {VALUES_TYPES} from "../constants.js";

// Get function signature
const getFunctionSignature = value => {
    const code = Function.toString.call(value).trim();
    // Classic function signature
    if (code.startsWith("function")) {
        return code.substring(0, code.indexOf("{")).replace(/^function/, "").trim();
    }
    // Arrow function signature
    return code.substring(0, code.indexOf("=>")).trim();
};

// Get the object type: it can be an array, function, set, map, or just object
const getObjectType = value => {
    if (Array.isArray(value)) {
        return VALUES_TYPES.ARRAY;
    }
    else if (Object.prototype.toString.call(value) === "[object Set]") {
        return VALUES_TYPES.SET;
    }
    else if (Object.prototype.toString.call(value) === "[object Map]") {
        return VALUES_TYPES.MAP;
    }
    // Fallback -> just object
    return VALUES_TYPES.OBJECT;
};

// Generate values
const getObjectEntries = (type, obj) => {
    if (type === VALUES_TYPES.MAP) {
        return Array.from(obj);
    }
    else if (type === VALUES_TYPES.SET || type === VALUES_TYPES.ARRAY) {
        return Array.from(obj).map((value, index) => ([index, value]));
    }
    // Fallback --> execute Object.entries
    return Object.entries(obj);
};

export const ObjectValue = props => {
    const [open, setOpen] = React.useState(false);
    const type = getObjectType(props.value);
    const entries = getObjectEntries(type, props.value);
    const displayName = props.value?.constructor ? props.value.constructor.name : "Object";
    const handleToggle = event => {
        event.stopPropagation();
        setOpen(prevOpen => entries.length > 0 && !prevOpen);
    };

    // Render only a preview of the object
    if (props.preview) {
        return (
            <span className="kori-value object">
                <em>{displayName}</em>
            </span>
        );
    }

    if (!open) {
        // If object is not expanded, we want to display only some keys of the object
        const visibleEntries = entries.slice(0, props.maxClosedKeys);
        return (
            <div className="kori-value object" onClick={handleToggle}>
                <em>{displayName}</em>
                <span className="">{type === VALUES_TYPES.ARRAY ? "[ " : "{ "}</span>
                {visibleEntries.map((entry, index) => (
                    <span key={"entry" + index}>
                        {type === VALUES_TYPES.MAP && (
                            <span className="">
                                <Value value={entry[0]} />
                                <span className="">{" => "}</span>
                            </span>
                        )}
                        {(type === VALUES_TYPES.OBJECT || type === VALUES_TYPES.SET) && (
                            <span className="">
                                <span className="object-key">{entry[0]}</span>
                                <span className="">{": "}</span>
                            </span>
                        )}
                        <span className="">
                            <Value value={entry[1]} preview={true} />
                        </span>
                        {index + 1 < entries.length && (
                            <span className="">, </span>
                        )}
                    </span>
                ))}
                {visibleEntries.length < entries.length && (
                    <span className="object-more">…</span>
                )}
                <span className="">{type === VALUES_TYPES.ARRAY ? " ]" : " }"}</span>
            </div>
        );
    }

    // Render full object
    return (
        <div className="kori-value object" onClick={handleToggle}>
            <div className="object-header">
                <em>{displayName}</em>
                <span className="">{type === VALUES_TYPES.ARRAY ? "[ " : "{ "}</span>
            </div>
            <div className="object-body">
                {entries.map((entry, index) => (
                    <div className="object-entry" key={"entry-" + index}>
                        {type === VALUES_TYPES.MAP && (
                            <div className="">
                                <Value value={entry[0]} />
                                <span className="">{" => "}</span>
                            </div>
                        )}
                        {type !== VALUES_TYPES.MAP && (
                            <div className="">
                                <span className="object-key">{entry[0]}</span>
                                <span className="">{": "}</span>
                            </div>
                        )}
                        <div className="">
                            <Value value={entry[1]} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="object-footer">
                <span className="">{type === VALUES_TYPES.ARRAY ? " ]" : " }"}</span>
            </div>
        </div>
    );
};

ObjectValue.defaultProps = {
    value: {},
    preview: false,
    maxClosedKeys: 5,
};

export const NullValue = () => (
    <span className="kori-value null">null</span>
);

export const UndefinedValue = () => (
    <span className="kori-value undefined">undefined</span>
);

export const StringValue = props => (
    <span className="kori-value string">{props.value}</span>
);

export const NumberValue = props => (
    <span className="kori-value number">{props.value}</span>
);

export const BooleanValue = props => (
    <span className="kori-value boolean">{props.value ? "true" : "false"}</span>
);

export const FunctionValue = props => (
    <span className="kori-value function">
        <em>{"ƒunction"} {getFunctionSignature(props.value)}</em>
    </span>
);

// Tiny function to get the component for the given value
export const getValueComponentType = value => {
    const type = typeof value;
    if (type === VALUES_TYPES.OBJECT && value === null) {
        return NullValue;
    }
    else if (type === VALUES_TYPES.UNDEFINED) {
        return UndefinedValue;
    }
    else if (type === VALUES_TYPES.STRING) {
        return StringValue;
    }
    else if (type === VALUES_TYPES.NUMBER) {
        return NumberValue;
    }
    else if (type === VALUES_TYPES.BOOLEAN) {
        return BooleanValue;
    }
    else if (type === VALUES_TYPES.FUNCTION) {
        return FunctionValue;
    }
    // Other case, everyting is an object
    return ObjectValue;
};

export const Value = props => {
    return React.createElement(getValueComponentType(props.value), {
        value: props.value,
        preview: !!props.preview,
    });
};

Value.defaultProps = {
    value: null,
    preview: false,
};