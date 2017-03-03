var express = require('express');
var router = express.Router();
var projectController = require('../controllers/projectController');

//Get homepage
router.get('/', projectController.getAllProjects);


function ensureAuthenticated(req, res, next)
{
	if(req.isAuthenticated())
		return next();
	else 
	{
		req.flash('errorMessage','Please log in first.');
		res.redirect('/users/login');
	}
}

module.exports = router;