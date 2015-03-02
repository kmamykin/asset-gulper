var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var cssLoaders = ['style', 'css', 'autoprefixer-loader?browsers=last 2 versions'];
var scssLoaders = cssLoaders.concat(["sass?precision=10&outputStyle=expanded&sourceMap=true"]);
//var scssLoaders = cssLoaders.concat(["sass?precision=10&outputStyle=expanded&sourceMap=true&includePaths[]=" + path.resolve(__dirname, './bower_components')]);
var styleModLoaders = [
    { test: /\.css$/ , loaders: cssLoaders },
    { test: /\.scss$/, loaders: scssLoaders }
];

var staticModLoaders = [
    { test: /\.gif$/ , loader: "url?limit=10000&mimetype=image/gif" },
    { test: /\.jpg$/ , loader: "url?limit=10000&mimetype=image/jpg" },
    { test: /\.png$/ , loader: "url?limit=10000&mimetype=image/png" },
    { test: /\.woff$/, loader: "url?limit=10000&mimetype=application/font-woff" },
    { test: /\.ttf$/ , loader: "file?mimetype=application/vnd.ms-fontobject" },
    { test: /\.eot$/ , loader: "file?mimetype=application/x-font-ttf" },
    { test: /\.svg$/ , loader: "file?mimetype=image/svg+xml" }
];

module.exports = {
    watchConfig: function(config) {
        var server = this.serverConfig(config);
        return {
            context: config.currentDir,
            entry: {
                app: [
                    'webpack-dev-server/client?http://' + server.host + ':' + server.port,
                    'webpack/hot/only-dev-server',
                    path.join(config.app, config.main)
                ],
                vendor: config.vendor || []
            },
            output: {
                path: path.join(config.currentDir, config.outputDir),
                filename: 'app.bundle.js',
                publicPath: config.publicPath
            },
            module: {
                loaders: [
                    { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ }
                ].concat(styleModLoaders).concat(staticModLoaders)
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
            cache: true,
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
                publicPath: config.publicPath
            },
            module: {
                loaders: [
                    { test: /\.jsx?$/, loaders: ['jsx?harmony'], exclude: /node_modules/ }
                ].concat(styleModLoaders).concat(staticModLoaders)
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
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    "windows.jQuery": "jquery"
                }),
                new webpack.optimize.CommonsChunkPlugin("vendor", "[name].bundle.[hash].js"),
                new HtmlWebpackPlugin({
                    template: path.join(config.app, 'index.html')
                }),
                //new webpack.optimize.DedupePlugin(),
                //new webpack.optimize.UglifyJsPlugin(),
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
            host: 'localhost',
            port: config.port || 8080
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
