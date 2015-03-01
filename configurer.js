var webpack = require('webpack');
var path = require('path');

module.exports = {
    watchConfig: function(config) {
        return {
            context: config.currentDir,
            entry: [
                'webpack-dev-server/client?http://' + config.devServer.host + ":" + config.devServer.port,
                'webpack/hot/only-dev-server',
                path.join(config.app, config.main)
            ],
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
            entry: [
                path.join(config.app, config.main)
            ],
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
                new webpack.DefinePlugin({
                    "process.env": {
                        // This has effect on the react lib size
                        "NODE_ENV": JSON.stringify("production")
                    }
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin()
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
