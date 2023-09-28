import React from "react";
import {CopyIcon, TrashIcon} from "@josemi-icons/react";
import {delay, copyTextToClipboard} from "../utils.js";

const CellId = props => {
    const [copied, setCopied] = React.useState(false);
    const timer = React.useRef(null);
    const handleClick = () => {
        copyTextToClipboard(`cell:${props.id}`);
        setCopied(true);
        timer.current = delay(props.copiedDelay, () => {
            setCopied(false);
        });
    };
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={handleClick}>
                <div className="flex items-center text-xs">
                    <span>cell:<b>{props.id}</b></span>
                </div>
                <div className="flex items-center text-sm select-none">
                    <CopyIcon />
                </div>
            </div>
            {props.copiedMessage && copied && (
                <div className="bg-gray-800 text-white text-2xs font-bold rounded-sm px-1 select-none">
                    <span>{props.copiedMessage}</span>
                </div>
            )}
        </div>
    );
};

CellId.defaultProps = {
    id: "",
    copiedDelay: 2000,
    copiedMessage: "Cell ID copied!",
};

const Button = props => (
    <div className="flex items-center text-gray-400 hover:text-gray-600 cursor-pointer" onClick={props.onClick}>
        {props.icon}
    </div>
);

const Separator = () => (
    <div className="first:hidden h-3 w-px bg-gray-300" />
);

export const CellHeader = props => (
    <div className="w-full flex justify-between items-center gap-2 py-2">
        <div className="flex items-center gap-2">
            {props.id && (
                <CellId id={props.id} />
            )}
        </div>
        <div className="flex items-center gap-2">
            {props.showDeleteButton && (
                <React.Fragment>
                    <Separator />
                    <Button
                        icon={(<TrashIcon />)}
                        onClick={props.onDelete}
                    />
                </React.Fragment>
            )}
        </div>
    </div>
);

CellHeader.defaultProps = {
    id: null,
    showDeleteButton: false,
    onDelete: null,
    onInsert: null,
};
