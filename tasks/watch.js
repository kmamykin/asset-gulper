var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var gutil = require('gulp-util');
var path = require('path');

module.exports = function(gulp, config) {
    gulp.task('watch', function(cb) {
        var watchConfig = webpackWatchConfig(config);
        gutil.log("Running webpack dev server with config:", watchConfig);
        // Start a webpack-dev-server
        new WebpackDevServer(webpack(watchConfig), {
            publicPath: watchConfig.output.publicPath,
            hot: true,
            historyApiFallback: true,
            stats: { colors: true }
        }).listen(8080, "localhost", function(err) {
                if (err) {
                    throw new gutil.PluginError("webpack-dev-server", err);
                }
                gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
                cb();
            });

    });
};

function webpackWatchConfig(config) {
    return {
        context: config.currentDir,
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
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
                { test: /\.js?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ },
                { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ }
            ]
        },
        resolve: {
            root: [config.currentDir, path.join(config.currentDir, "node_modules")],
            fallback: path.join(__dirname, "..", "node_modules"),
            extensions: ['', '.js', '.jsx']
        },
        resolveLoader: {
            root: path.join(__dirname, "..", "node_modules"),
            fallback: path.join(config.currentDir, "node_modules")
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        watch: true,
        watchDelay: 200,
        debug: true,
        devtool: 'eval',
    };
}
