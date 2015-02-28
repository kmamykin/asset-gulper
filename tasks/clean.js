// https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
var del = require('del');
var gutil = require('gulp-util');

module.exports = function(gulp, config) {
    gulp.task('clean', function(cb) {
        del(config.outputDir, function (err, deletedFiles) {
            gutil.log('Files deleted:', deletedFiles.join(', '));
            cb();
        });
    });
};
