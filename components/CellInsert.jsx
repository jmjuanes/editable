import React from "react";
import {PlusIcon} from "@josemi-icons/react";
import {Dropdown, DropdownItem} from "./Dropdown.jsx";
import {CELL_TYPES} from "../constants.js";

export const CellInsert = props => (
    <div className="flex items-center my-1 group cursor-pointer" style={{marginLeft:"-3rem"}} tabIndex="0">
        <div className="flex justify-end w-12 relative">
            <div className="flex relative mr-2">
                <div className="flex text-sm text-neutral-300 group-hover:text-neutral-900 group-hover:bg-neutral-100 group-focus-within:text-neutral-950 group-focus-within:bg-neutral-200 p-1 rounded">
                    <PlusIcon />
                </div>
                <Dropdown className="absolute top-full left-0 mt-1 hidden group-focus-within:block z-5">
                    <DropdownItem
                        icon="braces"
                        text="JavaScript"
                        onClick={() => props.onInsert(CELL_TYPES.CODE)}
                    />
                    <DropdownItem
                        icon="text-left"
                        text="Text"
                        onClick={() => props.onInsert(CELL_TYPES.TEXT)}
                    />
                </Dropdown>
            </div>
        </div>
        <div className="flex items-center w-full">
            <div className="w-full group-hover:bg-neutral-100 group-focus-within:bg-neutral-200" style={{height:"2px"}} />
        </div>
    </div>
);

CellInsert.defaultProps = {
    onInsert: null,
};
