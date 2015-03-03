var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var configurator = require('./configurator');
var del = require('del');

module.exports = function(config) {
    var log = config.logger || defaultLogger();
    log("Asset-gulper initialized");
    return {
        clean: function(callback) {
            // https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
            del(config.outputDir + '/**/*', function(err, deletedFiles) {
                log('Files deleted:', deletedFiles.join(', '));
                callback();
            });
        },
        compile: function(callback) {
            this.clean(function() {
                var webpackConfig = configurator.compileConfig(config);
                // run webpack
                webpack(webpackConfig, checkError(function(stats) {
                    log("[webpack:compile]", stats.toString({ colors: true }));
                    callback();
                }));
            });
        },
        watch: function(options, callback) {
            var webpackConfig = configurator.watchConfig(config);
            log("Running webpack dev server with config:", webpackConfig);
            var server = configurator.serverConfig(options);
            new WebpackDevServer(webpack(webpackConfig), {
                publicPath: webpackConfig.output.publicPath,
                hot: true,
                historyApiFallback: true,
                stats: { colors: true }
            }).listen(server.port, server.host, checkError(function() {
                    log("[webpack-dev-server]", "http://" + server.host + ":" + server.port + "/webpack-dev-server/index.html");
                    callback();
                }));

        }
    };
};

function defaultLogger() {
    return function() {
        console.log.apply(console, Array.prototype.slice.call(arguments));
    };
}

function checkError(onSuccess) {
    return function(err) {
        if (err) {
            throw err;
        } else {
            onSuccess.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    };
}
