const React = require("react");
const {Layout} = require("./components/Layout.jsx");

const PageWrapper = props => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
            <meta name="title" content={props.site.title} />
            <meta name="description" content={props.site.description} />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@900&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@700&display=swap" />
            <link rel="stylesheet" href={"./low.css"} />
            <title>{`${props.page.data.title} - ${props.site.title}`}</title>
            <style>{`.font-plex {font-family: IBM Plex Serif, serif;}`}</style>
        </head>
        <body className="bg-white m-0 p-0 font-inter text-gray-900 leading-normal">
            <Layout navbarLinkTarget="_self">
                {props.page.data.layout === "default" && (
                    <React.Fragment>
                        {props.element}
                    </React.Fragment>
                )}
            </Layout>
        </body>
    </html>
);

module.exports = {
    input: "docs",
    output: "www",
    siteMetadata: {
        title: "Editable",
        description: "Editable: web based notebooks for prototyping, exploration and presentation",
    },
    pageComponents: {
        // Define your custom components here
    },
    pageWrapper: PageWrapper,
};
