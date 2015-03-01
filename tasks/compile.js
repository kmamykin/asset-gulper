var webpack = require('webpack');
var gutil = require('gulp-util');
var configurer = require('../configurer');

module.exports = function(gulp, config) {
    gulp.task('compile', function(callback) {
        var webpackConfig = configurer.compileConfig(config);
        // run webpack
        webpack(webpackConfig, function(err, stats) {
            if (err) throw new gutil.PluginError("webpack:compile", err);
            gutil.log("[webpack:compile]", stats.toString({
                colors: true
            }));
            callback();
        });

    });
};
