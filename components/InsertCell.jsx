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
    <div className="flex items-center justify-center gap-2 o-10 hover:o-100 select-none p-2 border-2 border-gray-300 border-dashed rounded-md">
        <div className="text-xs text-gray-400">
            <span>Insert Cell:</span>
        </div>
        <InsertCellButton
            text="Code"
            icon={(<CodeIcon />)}
            onClick={() => props.onInsert(CELL_TYPES.CODE)}
        />
        <InsertCellButton
            text="Text"
            icon={(<TextLeftIcon />)}
            onClick={() => props.onInsert(CELL_TYPES.TEXT)}
        />
    </div>
);

InsertCell.defaultProps = {
    onInsert: null,
};
