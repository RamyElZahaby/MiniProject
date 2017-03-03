var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var projectController = require('../controllers/projectController');
var multer = require('multer');

var User = require('../models/users');
var Project = require('../models/project');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
        const buf = crypto.randomBytes(48);
        cb(null, Date.now() + buf.toString('hex') + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});



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
  passport.authenticate('local', {successRedirecxt:'/users/profile', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) 
  {
    req.session.loggedin = req.body.username;
    res.redirect('/users/profile');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You have been logged out successfully.');

	res.redirect('/');
});

router.get('/profile', projectController.getUserWorks);

router.post('/profile', projectController.createProject);

module.exports = router;