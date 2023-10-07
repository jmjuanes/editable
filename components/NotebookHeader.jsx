import React from "react";
import {GitBranchIcon, DotsVerticalIcon, renderIcon, LockIcon} from "@josemi-icons/react";
import {Dropdown, DropdownItem, DropdownSeparator} from "./Dropdown.jsx";

const NotebookTitle = props => {
    const value = React.useRef(props.value);
    return (
        <input
            type="text"
            className="bg-white outline-0 p-0 text-gray-800 text-4xl font-black w-full"
            defaultValue={props.value}
            placeholder={props.placeholder || "untitled"}
            onChange={event => {
                value.current = event.target.value || "";
            }}
            onBlur={() => {
                // Only trigger onChange event if new title is different from current saved title
                if (props.value !== value.current) {
                    props.onChange(value.current);
                }
            }}
        />
    );
};

const NotebookForkBanner = props => (
    <div className="flex items-center justify-between gap-4 rounded-md bg-green-600 text-white p-4">
        <div className="flex items-center gap-2">
            <div className="flex items-center text-lg">
                <GitBranchIcon />
            </div>
            <div className="font-bold">
                <span>Fork this notebook to make it editable.</span>
            </div>
        </div>
        <div className="rounded bg-white text-green-600 text-sm px-2 py-1 cursor-pointer" onClick={props.onClick}>
            <strong>Fork it!</strong>
        </div>
    </div>
);

const MetadataItem = props => (
    <div className="flex items-center gap-1 select-none">
        {props.icon && (
            <div className="flex text-gray-400 text-lg">
                {renderIcon(props.icon)}
            </div>
        )}
        {props.label && (
            <div className="flex items-center text-gray-700 text-xs">
                {props.label}
            </div>
        )}
        <div className="text-gray-500 text-sm font-medium">
            {props.children}
        </div>
    </div>
);

// Export notebook header
export const NotebookHeader = props => (
    <div className="mb-6">
        {props.showForkBanner && (
            <div className="mb-4">
                <NotebookForkBanner onClick={props.onForkNotebook} />
            </div>
        )}
        <div className="flex items-center justify-between gap-2 mb-1">
            <NotebookTitle
                value={props.title}
                onChange={props.onTitleChange}
            />
            <div className="group flex relative" tabIndex="0">
                <div className="rounded-md border border-gray-300 p-2 flex hover:bg-gray-100 group-focus-within:bg-gray-200 cursor-pointer">
                    <div className="flex items-center text-xl">
                        <DotsVerticalIcon />
                    </div>
                </div>
                <Dropdown className="absolute top-full right-0 mt-1 hidden group-focus-within:block z-5">
                    <DropdownItem
                        disabled={false}
                        icon="edit"
                        text="Edit metadata"
                        onClick={props.onEditMetadata}
                    />
                    <DropdownSeparator />
                    <DropdownItem
                        disabled={props.exportDisabled}
                        icon="download"
                        text="Export markdown"
                        onClick={props.onExport}
                    />
                </Dropdown>
            </div>
        </div>
        <div className="flex items-center gap-4">
            {props.author && (
                <MetadataItem icon="edit" label="By">
                    <span className="font-medium">{props.author}</span>
                </MetadataItem>
            )}
            {props.tags.length > 0 && (
                <MetadataItem icon="backspace" label="Tags:">
                    <div className="flex flex-wrap gap-1 ml-1">
                        {props.tags.map((tag, index) => (
                            <div key={index} className="flex items-center px-2 py-1 bg-gray-200 rounded-xl">
                                <span className="text-2xs leading-none text-gray-500 font-medium">{tag}</span>
                            </div>
                        ))}
                    </div>
                </MetadataItem>
            )}
        </div>
    </div>
);

NotebookHeader.defaultProps = {
    title: "",
    author: "",
    tags: [],
    exportDisabled: false,
    showForkBanner: false,
    onTitleChange: null,
    onExport: null,
    onEditMetadata: null,
};
