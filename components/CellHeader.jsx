import React from "react";
import {TrashIcon} from "@josemi-icons/react";

const Button = props => (
    <div className="flex items-center text-gray-400 hover:text-gray-600 cursor-pointer" onClick={props.onClick}>
        {props.icon}
    </div>
);

const Separator = () => (
    <div className="first:hidden h-3 w-px bg-gray-300" />
);

export const CellHeader = props => (
    <div className="w-full flex justify-end items-center gap-2 py-2">
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

CellHeader.defaultProps = {
    showDeleteButton: false,
    onDelete: null,
    onInsert: null,
};
