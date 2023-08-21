import React from "react";
import localClient from "../client.js";

// Client context object
const ClientContext = React.createContext({});

// Use client hook
export const useClient = () => {
    return React.useContext(ClientContext);
};

// Client provider component
export const ClientProvider = props => {
    return (
        <ClientContext.Provider value={localClient}>
            {props.children}
        </ClientContext.Provider>
    );
};
