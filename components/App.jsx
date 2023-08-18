import React from "react";
import Rouct from "rouct";
import {Layout} from "./Layout.jsx";
import {DashboardPage} from "./Dashboard.jsx";
import {NotebookPage} from "./Notebook.jsx";

export const App = () => (
    <Rouct.Router pathPrefix="" routing={Rouct.BrowserRouting}>
        <Layout>
            <Rouct.Switch>
                <Rouct.Route exact path="/" render={() => (
                    <div>Hello world</div>
                )} />
                <Rouct.Route exact path="/dashboard" render={() => (
                    <DashboardPage />
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
