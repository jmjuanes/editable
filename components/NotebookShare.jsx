import React from "react";
import {ClipboardIcon} from "@josemi-icons/react";
import {Modal} from "./Modal.jsx";
import {saveNotebookAsUrl} from "../notebook.js";
import {copyTextToClipboard} from "../utils.js";

export const NotebookShare = props => {
    const [notebookUrl, setNotebookUrl] = React.useState(null);
    const [copiedToUrl, setCopiedToUrl] = React.useState(false);

    const handleCopy = () => {
        copyTextToClipboard(notebookUrl).then(() => {
            setCopiedToUrl(true);
        });
    };

    React.useEffect(() => {
        saveNotebookAsUrl(props.notebook).then(url => {
            setNotebookUrl(url);
        });
    }, []);

    return (
        <Modal title="Share Notebook" onClose={props.onClose}>
            <div className="mb-2">
                <span>You can use the following URL to share this notebook.</span>
            </div>
            {notebookUrl && (
                <div className="mb-2">
                    <textarea
                        className="w-full h-48 bg-neutral-100 text-sm text-neutral-600 rounded-md p-4"
                        disabled={true}
                        defaultValue={notebookUrl}
                    />
                    <div className="mt-4 flex justify-end select-none">
                        <button className="w-full flex justify-center items-center rounded-md p-3 bg-neutral-950 hover:bg-neutral-900 cursor-pointer " onClick={handleCopy}>
                            <span className="flex text-white text-lg mr-1">
                                <ClipboardIcon />
                            </span>
                            <span className="text-white text-sm font-medium">
                                {copiedToUrl ? "Copied!" : "Copy to Clipboard"}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

NotebookShare.defaultProps = {
    notebook: null,
    onClose: null,
};
