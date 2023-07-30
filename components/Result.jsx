import React from "react";
import {RESULT_TYPES} from "../constants.js";

const ResultValue = props => {
    return (
        <div>{props.value}</div>
    );
};

export const Result = props => {
    const preview = React.useRef(null);
    return (
        <React.Fragment>
            {props.type === RESULT_TYPES.ERROR && (
                <div className="">
                    {props.errorMessage}
                </div>
            )}
            {(props.type === RESULT_TYPES.VALUE || props.type === RESULT_TYPES.HTML) && (
                <div ref={preview} className="border border-gray-300 rounded-md p-3 bg-white">
                    {props.type === RESULT_TYPES.VALUE && (
                        <ResultValue value={props.value} />
                    )}
                </div>
            )}
        </React.Fragment>
    );
};
