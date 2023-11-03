import React from "react";
import {CopyIcon, renderIcon} from "@josemi-icons/react";
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
            <div className="flex items-center gap-1 text-neutral-300 hover:text-neutral-700 cursor-pointer" onClick={handleClick}>
                <div className="flex items-center text-xs">
                    <span>cell:<b>{props.id}</b></span>
                </div>
                <div className="flex items-center text-sm select-none">
                    <CopyIcon />
                </div>
            </div>
            {props.copiedMessage && copied && (
                <div className="text-neutral-700 text-2xs font-bold rounded-sm px-1 select-none">
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
    <div className="flex items-center text-neutral-300 hover:text-neutral-900 cursor-pointer p-1 hover:bg-neutral-100 rounded" onClick={props.onClick}>
        {renderIcon(props.icon)}
    </div>
);

const Separator = () => (
    <div className="first:hidden h-3 w-px bg-neutral-200" />
);

export const CellHeader = props => (
    <div className="w-full flex justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
            {props.id && (
                <CellId id={props.id} />
            )}
        </div>
        <div className="flex items-center gap-1">
            {props.showExecuteButton && (
                <Button
                    icon="play"
                    onClick={props.onExecute}
                />
            )}
            {props.showDuplicateButton && (
                <Button
                    icon="copy"
                    onClick={props.onDuplicate}
                />
            )}
            {props.showDeleteButton && (
                <React.Fragment>
                    <Separator />
                    <Button
                        icon="trash"
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
    showDuplicateButton: false,
    showExecuteButton: false,
    onDelete: null,
    onDuplicate: null,
    onExecute: null,
};
