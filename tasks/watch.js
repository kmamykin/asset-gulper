var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var gutil = require('gulp-util');
var configurer = require('../configurer');

module.exports = function(gulp, config) {
    gulp.task('watch', function(callback) {
        var webpackConfig = configurer.watchConfig(config);
        gutil.log("Running webpack dev server with config:", webpackConfig);
        var server = configurer.serverConfig(config);
        // Start a webpack-dev-server
        new WebpackDevServer(webpack(webpackConfig), {
            publicPath: webpackConfig.output.publicPath,
            hot: true,
            historyApiFallback: true,
            stats: { colors: true }
        }).listen(server.port, server.host, function(err) {
                if (err) {
                    throw new gutil.PluginError("webpack-dev-server", err);
                }
                gutil.log("[webpack-dev-server]", "http://" + server.host + ":" + server.port + "/webpack-dev-server/index.html");
                callback();
            });

    });
};
