import React from "react";
import {CodeIcon, TextLeftIcon, TrashIcon} from "@josemi-icons/react";
import {BLOCK_TYPES} from "../constants.js";

const Button = props => (
    <div className="flex items-center text-gray-400 hover:text-gray-600 cursor-pointer" onClick={props.onClick}>
        {props.icon}
    </div>
);

const Separator = () => (
    <div className="first:hidden h-3 w-px bg-gray-300" />
);

export const BlockHeader = props => (
    <div className="w-full flex justify-end items-center gap-2 py-1">
        {props.showInsertButtons && (
            <React.Fragment>
                <Button
                    icon={(<CodeIcon />)}
                    onClick={() => props.onInsert(BLOCK_TYPES.CODE)}
                />
                <Button
                    icon={(<TextLeftIcon />)}
                    onClick={() => props.onInsert(BLOCK_TYPES.TEXT)}
                />
            </React.Fragment>
        )}
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
);

BlockHeader.defaultProps = {
    showDeleteButton: false,
    showInsertButtons: false,
    onDelete: null,
    onInsert: null,
};
