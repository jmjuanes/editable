import React from "react";
import {CloseIcon} from "@josemi-icons/react";
import {Modal} from "./Modal.jsx";

const TagsInput = props => {
    const handleKeyDown = event => {
        const value = event.target.value || "";
        if (event.key === "Enter" && value.trim().length > 0) {
            props.onChange([...props.value, value]);
            event.target.value = "";
        }
    };
    const handleTagRemove = index => {
        return props.onChange(props.value.filter((el, i) => i !== index));
    };
    return (
        <div className="flex flex-wrap items-center gap-2 border border-neutral-200 rounded-md p-2">
            {props.value.map((tag, index) => (
                <div className="flex items-center gap-2 pl-3 pr-2 py-2 bg-neutral-100 rounded-full" key={index}>
                    <div className="flex items-center text-neutral-800 text-xs leading-none">{tag}</div>
                    <div className="flex items-center cursor-pointer group" onClick={() => handleTagRemove(index)}>
                        <div className="flex items-center bg-neutral-500 group-hover:bg-neutral-700 text-white rounded-full">
                            <CloseIcon />
                        </div>
                    </div>
                </div>
            ))}
            <input
                onKeyDown={handleKeyDown}
                type="text"
                className="outline-none text-sm"
                placeholder={props.placeholder}
            />
        </div>
    );
};

TagsInput.defaultProps = {
    value: [],
    placeholder: "Type something...",
    onChange: null,
};

const FormField = props => (
    <div className="mb-6">
        <div className="mb-1">
            <span className="font-medium text-neutral-900 text-sm">{props.label}</span>
            {props.helper && (
                <span className="ml-2 text-neutral-500 text-xs">{props.helper}</span>
            )}
        </div>
        {props.children}
    </div>
);

export const NotebookMetadata = props => {
    const [author, setAuthor] = React.useState(props.author || "");
    const [tags, setTags] = React.useState([...props.tags]);
    const handleSubmit = () => {
        return props.onSubmit({
            author: author || "",
            tags: tags,
        });
    };
    return (
        <Modal title="Notebook Metadata" onClose={props.onClose}>
            <FormField label="Author">
                <input
                    type="text"
                    className="border border-neutral-200 rounded-md px-3 py-2 text-sm w-full outline-none"
                    defaultValue={author}
                    onChange={event => setAuthor(event.target.value || "")}
                />
            </FormField>
            <FormField label="Tags" helper="(press Enter to confirm the tag)">
                <TagsInput
                    value={tags}
                    onChange={newTags => setTags(newTags)}
                />
            </FormField>
            <div className="flex justify-end select-none">
                <button className="flex items-center rounded-md p-3 bg-neutral-950 hover:bg-neutral-900 cursor-pointer " onClick={handleSubmit}>
                    <span className="text-white text-sm font-medium">Save changes</span>
                </button>
            </div>
        </Modal>
    );
};

NotebookMetadata.defaultProps = {
    author: "",
    tags: [],
    onClose: null,
    onSubmit: null,
};
