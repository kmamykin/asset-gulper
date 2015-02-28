var gutil = require('gulp-util');
module.exports = function(config){
    gutil.log("Asset-gulper initialized");
    return {
        defineTasks: function(gulp, taskList){
            taskList.forEach(function(taskName){
               require("./tasks/" + taskName + ".js")(gulp, config);
            });
        }
    };
};
