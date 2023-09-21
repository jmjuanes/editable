import React from "react";
import {CodeIcon, TextLeftIcon} from "@josemi-icons/react";
import {CELL_TYPES} from "../constants.js";

const InsertCellButton = props => (
    <div className="flex items-center cursor-pointer" onClick={props.onClick}>
        <div className="flex items-center gap-1 text-gray-500 hover:text-gray-900 px-2">
            <div className="flex text-lg">
                {props.icon}
            </div>
            <div className="flex text-xs">{props.text}</div>
        </div>
    </div>
);

export const InsertCell = props => (
    <div className="flex items-center justify-center gap-2 o-60 hover:o-100 select-none">
        <div className="w-full h-px border-b border-dashed border-gray-300" />
        <div className="flex flex-nowrap gap-2 flex-grow w-full justify-center items-center">
            <InsertCellButton
                text="Insert Code"
                icon={(<CodeIcon />)}
                onClick={() => props.onInsert(CELL_TYPES.CODE)}
            />
            <InsertCellButton
                text="Insert Text"
                icon={(<TextLeftIcon />)}
                onClick={() => props.onInsert(CELL_TYPES.TEXT)}
            />
        </div>
        <div className="w-full h-px border-b border-dashed border-gray-300" />
    </div>
);

InsertCell.defaultProps = {
    onInsert: null,
};
