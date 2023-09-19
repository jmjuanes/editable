import React from "react";
import classNames from "classnames";
import {renderIcon} from "@josemi-icons/react";

export const DropdownSeparator = () => (
    <div className="bg-gray-200 h-px w-full my-2" />
);

export const DropdownGroup = props => (
    <div className="text-xs mb-2 text-gray-500 select-none">
        {props.title}
    </div>
);

export const DropdownItem = props => {
    const classList = classNames(props.className, {
        "flex items-center gap-2 rounded-md py-1 px-2 select-none": true,
        "hover:bg-gray-200 cursor-pointer": !props.disabled,
        "o-80 cursor-not-allowed": props.disabled,
    });
    const handleClick = () => {
        if (!props.disabled && typeof props.onClick === "function") {
            if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
            }
            return props.onClick();
        }
    };
    return (
        <div className={classList} tabIndex="0" onClick={handleClick}>
            {props.icon && (
                <div className="flex items-center text-md">
                    {renderIcon(props.icon)}
                </div>
            )}
            <div className="flex items-center text-sm">
                <span>{props.text}</span>
            </div>
        </div>
    );
};

DropdownItem.defaultProps = {
    className: "text-gray-700",
    icon: null,
    text: null,
    disabled: false,
    onClick: null,
};

export const Dropdown = props => (
    <div className={props.className}>
        <div className="bg-white border border-gray-200 shadow-sm w-48 p-1 rounded-lg flex flex-col gap-0">
            {props.children}
        </div>
    </div>
);

Dropdown.defaultProps = {
    className: "absolute top-0 left-0 mt-1",
};
