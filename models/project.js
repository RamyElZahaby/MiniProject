var mongoose = require('mongoose');

var projectSchema = mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },
    URL:{type:String, default:"N/A"},
    username: String,
    screenshot  :{type:String, default:"n/a"}
});

var Project = mongoose.model("project", projectSchema);

module.exports = Project;