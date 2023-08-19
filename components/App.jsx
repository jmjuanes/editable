import React from "react";
import Rouct from "rouct";
import {Layout} from "./Layout.jsx";

import IndexPage from "../pages/index.mdx";
import ProfilePage from "../pages/profile.mdx";
import NotebookPage from "../pages/n.mdx";

export const App = () => (
    <Rouct.Router pathPrefix="" routing={Rouct.BrowserRouting}>
        <Layout>
            <Rouct.Switch>
                <Rouct.Route exact path="/" render={() => (
                    <IndexPage />
                )} />
                <Rouct.Route exact path="/profile" render={() => (
                    <ProfilePage />
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
