var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');
var Project = require('../models/project');

//Get register page
router.get('/register', function(req, res)
{
    res.render('register');
});

//Get login page
router.get('/login', function(req, res)
{
    res.render('login');
});

//Registering a new user
router.post('/register', function(req, res)
{
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //Validate entries
 	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();


    if(errors)
    {
		res.render('register',{errors:errors});
	} 
    else 
    {
		var newUser = new User(
        {
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user)
        {
			if(err) throw err;
			console.log(user);
		});

		req.flash('successMessage', 'You have been registered successfully!');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) 
  {
   User.getUserByUsername(username, function(err, user)
   {
   	if(err) throw err;
   	if(!user)
	{
   		return done(null, false, {message: 'Invalid Username.'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch)
	{
   	if(err) throw err;
   		if(isMatch)
   			return done(null, user);
		   else 
   			return done(null, false, {message: 'Invalid password.'});
   	});
   });
  }));

  passport.serializeUser(function(user, done) 
  {
 	 done(null, user.id);
  });

passport.deserializeUser(function(id, done) 
{
  User.getUserById(id, function(err, user) 
  {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/profile', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/profile');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You have been logged out successfully.');

	res.redirect('/users/login');
});

router.get('/profile', function(req,res)
{
    res.render('profile');
});

router.post('/profile', function(req, res)
    {
        let project = new Project(req.body);

        project.save(function(err, project)
        {
            if(err)
            {
                res.send(err.message)
                console.log(err);
                req.flash('error_msg', err.message);
            }
            else
            {
                console.log(project);
                res.redirect('/users/profile');
                req.flash('success_msg', 'Project has been successfully created.');
            }
        })
    })

module.exports = router;