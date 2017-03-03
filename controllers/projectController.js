let Project = require('../models/project');
var session = require('express-session');

let projectController = 
{
    
    getAllProjects:function(req, res){
        
        Project.find(function(err, projects)
        {
            
            if(err)
                res.send(err.message);
            else
                res.render('index', {projects});
        })
    },

    createProject:function(req, res)
    {
        let project = new Project(req.body);
       
        project.username = req.user.username;

        project.save(function(err, project)
        {
            if(err)
            {
                res.send(err.message)
                console.log(err);
            }
            else
            {
                console.log(project);
                res.redirect('/users/profile');
            }
        })
    },


    getUserWorks: function(req,res)
    {    

      Project.find({username: req.session.loggedin},function(err, projects)
      {  
            if(err)
                res.send(err.message);
            else
                {
                    res.render('profile', {projects});
                }
        })
    }
}

module.exports = projectController;