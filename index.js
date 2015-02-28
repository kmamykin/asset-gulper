module.exports = function(config){
    console.log("Asset-gulper initialized");
    return {
        defineTasks: function(gulp, taskList){
            taskList.forEach(function(taskName){
               require("./tasks/" + taskName + ".js")(gulp, config);
            });
        }
    };
};
