import React from "react";

import {Layout} from "./Layout.jsx";
import {NotebookProvider} from "../contexts/NotebookContext.jsx";

import * as runner from "../runner.js";

export const App = () => {
    React.useEffect(() => {
        runner.initialize();
    }, []);

    return (
        <NotebookProvider>
            <Layout />
        </NotebookProvider>
    );
};
