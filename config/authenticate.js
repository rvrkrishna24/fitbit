var users = require('../app/models/user.js'),
	crypto = require('crypto'),
	winston = require('winston');

var createAuth = function() {
	return crypto.randomBytes(32).toString('hex');
};

var authCheck = function(req, res, next) {
	//console.log(req); //check for email also from the returned record
	var emailAddrs = req.params['uname'];
	var auth = req.headers['authorization'];
	var urlPath = req.originalUrl;
	if(auth) {
		var query = users.where({ authKey: auth });
		query.findOne(function (err, data) {
		  	if (err) {
                res.status(403).json({err: 'UnauthorizedError', 
                	msg: 'You are Forbidden from accessing this API'});
		  	}
		  	if (data) {
		  		if(data.username === emailAddrs) {
		  			return next();
		  		} else {
		  			winston.log('info', 'Valid Auth But incorrect attempt by: '+ emailAddrs);
		  			res.status(403).json({err: 'TokenUnauthorizedError', 
		  				msg: 'You are Forbidden from accessing this API'});
		  		}		  		
		  	} else {
		  		winston.log('info', 'Incorrect auth attempt made with: '+ emailAddrs);
		  		res.status(403).json({err: 'TokenUnauthorizedError', 
		  				msg: 'You are Forbidden from accessing this API'});
		  	}
		});
	} else {
		if(urlPath.indexOf('login') != -1 || urlPath.indexOf('google') != -1 || urlPath.indexOf('facebook') != -1) {
			return next();	
		} else {
			// res.writeHead(401, {
			// 	'Location': '/user/logout'
			// });
			// res.end();
			res.status(401).json({err: 'UnauthorizedError', msg: 
				'Unauthorized User'});
		}
  	}
};

module.exports = {
	authCheck: authCheck,
	createAuthToken: createAuth
}