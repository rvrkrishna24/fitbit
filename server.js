var fs = require('fs'),
	path = require('path'),
	restify = require('restify');
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),	
	config = require('./config/config'),		
	winston = require('winston');

var passport = require('passport'),
 	LocalStrategy = require('passport-local').Strategy;

var user = require('./app/models/user');

winston.add(winston.transports.File, { filename: 'logallerrors.log' });
winston.remove(winston.transports.Console);

var server = restify.createServer({
  name: 'fitbit',
  version: '1.0.0'
});

var connectToDb = function () {
  	var options = { server: { socketOptions: { keepAlive: 1 } } };
  	mongoose.connect(config.db, options);
};
connectToDb();

mongoose.connection.on('error', function(err){ console.log('Error: '+err) });
mongoose.connection.on('disconnected', connectToDb);

require('./config/passport')(passport); // pass passport for configuration

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var userCtrl = require('./app/controllers/user.js'),
	authenticate = require('./config/authenticate.js');

server.get(/.*/, restify.serveStatic({
  directory: './public/',
  default: 'views/index.html'
}));

server.post('/user/register', userCtrl.registerUser);

server.post('/user/login', authenticate.authCheck, userCtrl.loginUser);

server.get('/user/logout', userCtrl.userLogout);
//server.delete('/user', userCtrl.userDelete); //only for tests

//other apis

server.post('/users/:uname', authenticate.authCheck, userCtrl.addUserPlans);
server.put('/users/:uname', authenticate.authCheck, userCtrl.updateUserPlans);

//server.delete('/users/:uname', authenticate.authCheck, userCtrl.deleteUserWorkout);

server.get('/users/:uname/:day', authenticate.authCheck, userCtrl.getUserDetailsDay);

server.get('/fblogin', passport.authenticate('facebook', { scope : ['email'] }), userCtrl.fb.login );
server.get('/auth/facebook/callback', passport.authenticate('facebook'), userCtrl.fb.callback);

server.get('/googlelogin', authenticate.authCheck, passport.authenticate('google', { scope : 'email' }), userCtrl.google.login );
server.get('/auth/google/callback', authenticate.authCheck, passport.authenticate('google'), userCtrl.google.callback);

server.listen(3000, function () {
  console.log('listening -->' + server.name);
});
