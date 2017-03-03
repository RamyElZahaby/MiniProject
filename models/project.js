var mongoose = require('mongoose');

var projectSchema = mongoose.Schema(
{
    title:{
        type:String,
        required:true,
        unique:true
    },
    URL:{type:String, default:"N/A"},
    username: {type: String},
    img:{type:String, default:"n/a"}
});

var Project = mongoose.model("project", projectSchema);

module.exports = Project;