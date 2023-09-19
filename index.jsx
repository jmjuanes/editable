import React from "react";
import {createRoot} from "react-dom/client";

import {Layout} from "./components/Layout.jsx";
import {Notebook} from "./components/Notebook.jsx";
import {NotebookProvider} from "./contexts/NotebookContext.jsx";

import "./style.css";
import "lowcss/dist/low.css";
import "codecake/codecake.css";

createRoot(document.getElementById("root"))
    .render((
        <NotebookProvider>
            <Layout>
                <Notebook />
            </Layout>
        </NotebookProvider>
    ));
