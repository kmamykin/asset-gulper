var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    watchConfig: function(config) {
        return {
            context: config.currentDir,
            entry: {
                app: [
                    'webpack-dev-server/client?http://' + config.devServer.host + ":" + config.devServer.port,
                    'webpack/hot/only-dev-server',
                    path.join(config.app, config.main)
                ],
                vendor: config.vendor || []
            },
            output: {
                path: path.join(config.currentDir, config.outputDir),
                filename: 'app.bundle.js',
                publicPath: '/' + config.outputDir + '/'
            },
            module: {
                loaders: [
                    { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ }
                ]
            },
            resolve: {
                root: [config.currentDir, path.join(config.currentDir, "node_modules")],
                fallback: path.join(__dirname, "node_modules"),
                extensions: ['', '.js', '.jsx']
            },
            resolveLoader: {
                root: path.join(__dirname, "node_modules"),
                fallback: path.join(config.currentDir, "node_modules")
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "windows.jQuery": "jquery"
                }),
                new webpack.optimize.CommonsChunkPlugin("vendor", "[name].bundle.js"),
                new HtmlWebpackPlugin({
                    template: path.join(config.app, 'index.html')
                }),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoErrorsPlugin()
            ],
            watch: true,
            watchDelay: 200,
            debug: true,
            devtool: 'eval'
        };
    },
    compileConfig: function(config) {
        return {
            context: config.currentDir,
            entry: {
                app: path.join(config.app, config.main),
                vendor: config.vendor || []
            },
            output: {
                path: path.join(config.currentDir, config.outputDir),
                filename: '[name].bundle.[hash].js',
                publicPath: '/' + config.outputDir + '/'
            },
            module: {
                loaders: [
                    { test: /\.jsx?$/, loaders: ['jsx?harmony'], exclude: /node_modules/ }
                ]
            },
            resolve: {
                root: [config.currentDir, path.join(config.currentDir, "node_modules")],
                fallback: path.join(__dirname, "node_modules"),
                extensions: ['', '.js', '.jsx']
            },
            resolveLoader: {
                root: path.join(__dirname, "node_modules"),
                fallback: path.join(config.currentDir, "node_modules")
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": {
                        // This has effect on the react lib size
                        "NODE_ENV": JSON.stringify("production")
                    }
                }),
                //new webpack.optimize.DedupePlugin(),
                //new webpack.optimize.UglifyJsPlugin(),
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "windows.jQuery": "jquery"
                }),
                new webpack.optimize.CommonsChunkPlugin("vendor", "[name].bundle.[hash].js"),
                new HtmlWebpackPlugin({
                    template: path.join(config.app, 'index.html')
                }),
                function() {
                    this.plugin("done", function(stats) {
                        require("fs").writeFileSync(
                            path.join(config.currentDir, config.outputDir, "stats.json"),
                            JSON.stringify(omitKeys(stats.toJson(), ['modules', 'chunks']), null, 2));
                    });
                }
            ]
        };
    },
    serverConfig: function(config) {
        return {
            host: config.devServer.host || 'localhost',
            port: config.devServer.port || 8080
        }
    }
};

function omitKeys(obj, keys) {
    var dup = {};
    for (key in obj) {
        if (keys.indexOf(key) === -1) {
            dup[key] = obj[key];
        }
    }
    return dup;
}
// TODO: https://github.com/glebm/gulp-webpack-react-bootstrap-sass-template/blob/master/webpack.config.litcoffee
