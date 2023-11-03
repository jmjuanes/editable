const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const pkg = require("./package.json");

module.exports = {
    mode: process.env.NODE_ENV || "development", // "production",
    target: "web",
    entry: {
        app: path.join(__dirname, "index.jsx"),
    },
    output: {
        path: path.join(__dirname, "www"),
        publicPath: "./",
        filename: "[contenthash].js",
        assetModuleFilename: "assets/[hash][ext][query]",
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devServer: {
        hot: false,
        static: {
            directory: path.join(__dirname, "www"),
            staticOptions: {
                extensions: ["html"],
            },
        },
        devMiddleware: {
            writeToDisk: true,
        },
    },
    externals: {
        Babel: "Babel",
    },
    resolve: {
        alias: {
            // "@koridev/datatable": path.join(__dirname, "packages", "datatable", "index.jsx"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    __dirname,
                ],
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env", 
                        "@babel/preset-react",
                    ],
                    plugins: [
                        "@babel/plugin-transform-react-jsx",
                        "@babel/plugin-transform-runtime",
                    ],
                },
            },
            // {
            //     test: /\.mdx?$/,
            //     loader: "@mdx-js/loader",
            // },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: "[contenthash].css",
            chunkFilename: "[id].css",
        }),
        new webpack.DefinePlugin({
            "process.env.VERSION": JSON.stringify(pkg.version),
            "process.env.URL_REPOSITORY": JSON.stringify(pkg.repository),
            "process.env.URL_ISSUES": JSON.stringify(pkg.bugs),
            "process.env.URL_HOMEPAGE": JSON.stringify(pkg.homepage),
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(__dirname, "index.html"),
            filename: "index.html",
            minify: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                path.join(__dirname, "node_modules", "@babel/standalone", "babel.min.js"),
                path.join(__dirname, "welcome.yml"),
            ],
        }),
    ],
};
