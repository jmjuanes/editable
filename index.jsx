import React from "react";
import {createRoot} from "react-dom/client";

// Import styles
import "lowcss/dist/low.css";

const App = props => {
    return (
        <div align="center">
            Hello world
        </div>
    );
};

createRoot(document.getElementById("root")).render(<App />);
