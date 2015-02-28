// https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
var del = require('del');

module.exports = function(gulp, config) {
    gulp.task('clean', function(cb) {
        del(config.outputDir, function (err, deletedFiles) {
            console.log('Files deleted:', deletedFiles.join(', '));
            cb();
        });
    });
};
