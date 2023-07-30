import React from "react";

import {Layout} from "./Layout.jsx";
import {NotebookProvider} from "../contexts/NotebookContext.jsx";

export const App = () => {
    return (
        <NotebookProvider>
            <Layout />
        </NotebookProvider>
    );
};
