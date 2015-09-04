var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	passport = require('passport');

var users = require('../app/models/user.js');

var userCtrl = require('../app/controllers/user.js'),
	authenticate = require('./authenticate.js');

router.get('/', function(req, res, next) {
	res.render('index');
});

router.post('/user/register', userCtrl.registerUser);

router.post('/user/login', authenticate.authCheck, userCtrl.loginUser);

router.get('/user/logout', userCtrl.userLogout);
router.delete('/user', userCtrl.userDelete); //only for tests

//other apis

router.post('/users/:uname', authenticate.authCheck, userCtrl.addUserPlans);
router.put('/users/:uname', authenticate.authCheck, userCtrl.updateUserPlans);

router.delete('/users/:uname', authenticate.authCheck, userCtrl.deleteUserWorkout);

router.get('/users/:uname/:day', authenticate.authCheck, userCtrl.getUserDetailsDay);

router.get('/fblogin', passport.authenticate('facebook', { scope : ['email'] }), userCtrl.fb.login );
router.get('/auth/facebook/callback', passport.authenticate('facebook'), userCtrl.fb.callback);

router.get('/googlelogin', authenticate.authCheck, passport.authenticate('google', { scope : 'email' }), userCtrl.google.login );
router.get('/auth/google/callback', authenticate.authCheck, passport.authenticate('google'), userCtrl.google.callback);


module.exports = router;