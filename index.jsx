import React from "react";
import {createRoot} from "react-dom/client";

import {App} from "./components/App.jsx";

import "lowcss/dist/low.css";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(<App />);
