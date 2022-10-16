const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        bundle: path.resolve(__dirname, "src/index.js"),
    },
    output:{
        path: path.resolve(__dirname, "public"),
        filename: "[name][contenthash].js",
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    devtool:"source-map",
    devServer:{
        port: "3000",
        static:["./public"],
        open: true,
        hot: true,
        liveReload: true
    },
    target:"web",
    resolve: {
        extensions: ['.js','.jsx','.json'],
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ttf|woff|woff2)$/i,
                exclude: /node_modules/,
                type: 'asset/resource'
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: "NFT displayer",
            filename: "index.html",
            template: "./src/index.html",
            favicon: "./src/favicon.ico"
        }),
        new NodePolyfillPlugin
    ]
};