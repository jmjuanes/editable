import React from "react";

export const Title = props => {
    const value = React.useRef(props.value);

    return (
        <div className="pl-12 mb-4">
            <input
                type="text"
                className="bg-white outline-0 p-0 text-gray-600 text-4xl font-black w-full"
                defaultValue={props.value}
                placeholder={props.placeholder}
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
        </div>
    );
};

Title.defaultProps = {
    value: "",
    placeholder: "untitled",
    onChange: null,
};
