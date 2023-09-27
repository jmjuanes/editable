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
    <div className="w-full flex justify-between items-center gap-2 py-2">
        <div className="flex items-center gap-2">
            {props.id && (
                <div className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
                    <strong>cell:{props.id}</strong>
                </div>
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
