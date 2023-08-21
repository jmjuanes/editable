import React from "react";
import Rouct from "rouct";
import {createNotebook} from "../notebook.js";
import {ClientProvider, useClient} from "../contexts/ClientContext.jsx";
import {useForceUpdate} from "../hooks/useForceUpdate.js";
import {Layout} from "./Layout.jsx";

import IndexPage from "../pages/index.mdx";
import ProfilePage from "../pages/profile.mdx";
import NotebookPage from "../pages/n.mdx";

const InnerApp = () => {
    const [updateKey, forceUpdate] = useForceUpdate();
    const client = useClient();
    const handleCreateNotebook = () => {
        const newNotebook = createNotebook();
        client.addNotebook(newNotebook).then(id => {
            Rouct.redirect(`/n?id=${id}`);
        });
    };
    return (
        <Rouct.Router pathPrefix="" routing={Rouct.BrowserRouting}>
            <Layout onCreateNotebook={handleCreateNotebook}>
                <Rouct.Switch>
                    <Rouct.Route exact path="/" render={() => (
                        <IndexPage
                            onCreateNotebook={handleCreateNotebook}
                        />
                    )} />
                    <Rouct.Route exact path="/profile" render={() => (
                        <ProfilePage
                            key={updateKey}
                            onCreateNotebook={handleCreateNotebook}
                            onOpenNotebook={notebookId => {
                                Rouct.redirect(`/n?id=${notebookId}`);
                            }}
                            onDeleteNotebook={notebookId => {
                                client.deleteNotebook(notebookId).then(() => {
                                    forceUpdate();
                                });
                            }}
                        />
                    )} />
                    <Rouct.Route exact path="/n" render={request => (
                        <NotebookPage
                            key={"notebook:" + request.query.id}
                            id={request.query.id}
                        />
                    )} />
                </Rouct.Switch>
            </Layout>
        </Rouct.Router>
    );
};

export const App = () => (
    <ClientProvider>
        <InnerApp />
    </ClientProvider>
);
