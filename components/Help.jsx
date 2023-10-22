import React from "react";
import {CloseIcon} from "@josemi-icons/react";
import {useNotebook} from "../contexts/NotebookContext.jsx";
import {useSessionStorage} from "../hooks/useStorage.js";

export const Help = () => {
    const notebook = useNotebook();
    const defaultVisible = notebook.data.createdAt === notebook.data.updatedAt;
    const [visible, setVisible] = useSessionStorage("editable-help-visible", defaultVisible);
    return (
        <React.Fragment>
            {visible && (
                <div className="relative border border-gray-200 rounded-lg p-6 mb-8 text-gray-900">
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                        <div className="flex items-center group cursor-pointer" onClick={() => setVisible(false)}>
                            <div className="flex items-center text-2xl text-gray-500 group-hover:text-gray-900">
                                <CloseIcon />
                            </div>
                        </div>
                    </div>
                    <div className="hidden items-center gap-2 leading-none mb-6">
                        <span className="flex items-center text-xl">👋</span>
                        <span className="font-bold text-2xl">Welcome to Editable!</span>
                    </div>
                    <ul className="text-sm pl-4">
                        <li className="mb-2" style={{listStyleType:"circle"}}>
                            <span>Your document is saved in your browser's session storage. </span>
                            <span>Every new tab is a fresh document, and you can seamlessly switch between them. </span>
                            <span className="font-bold">Unsaved changes are lost when you close a tab.</span>
                        </li>
                        <li className="mb-2" style={{listStyleType:"circle"}}>
                            <span>You can load packages directly from the NPM registry, just <code className="font-bold text-xs text-pink-600">import</code> them.</span>
                        </li>
                        <li className="mb-0" style={{listStyleType:"circle"}}>
                            <span>If a cell returns a React component, it will be automatically rendered, </span>
                            <span>allowing you to visualize and interact with your React components in real-time.</span>
                        </li>
                    </ul>
                </div>
            )}
        </React.Fragment>
    );
};
