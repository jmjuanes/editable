import React from "react";
import {CloseIcon} from "@josemi-icons/react";

export const Modal = props => (
    <React.Fragment>
        <div className="fixed w-full h-full bg-white o-90 z-9 top-0 left-0 backdrop-blur-md" />
        <div className="fixed w-full h-full flex items-center justify-center z-10 top-0 left-0">
            <div className="rounded-lg bg-white w-full p-6 max-w-lg border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-4 select-none">
                    <div className="flex items-center text-lg font-bold text-neutral-900">
                        <span>{props.title}</span>
                    </div>
                    <div className="flex group" onClick={props.onClose}>
                        <div className="flex text-2xl text-neutral-500 group-hover:text-neutral-900 cursor-pointer">
                            <CloseIcon />
                        </div>
                    </div>
                </div>
                {props.children}
            </div>          
        </div>
    </React.Fragment>
);
