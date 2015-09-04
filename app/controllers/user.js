var users = require('../../app/models/user.js');

var winston = require('winston'),
	_ = require('lodash'),
	crypto = require('crypto');

winston.log('info', 'Called the user.js file');

var config = require('../../config/config.js'),
	authenticate = require('../../config/authenticate.js');

var passport = require('passport'),
	http = require('http'),
	url = require('url');

var userCtrl = {
	registerUser: function(req, res) {
		if(!req.body.username && !req.body.password)
			return;

		var uname = req.body.username,
			pass = req.body.password;

		users.register(new users({ username: uname, authKey: authenticate.createAuthToken() }), pass, function(err, user) {
		    if (err) {
		    	winston.log('error', 'Register error', {err: err});
		      	return res.status(500).json({err: err});
		    }
		    passport.authenticate('local')(req, res, function () {
		    	winston.log('info', 'Register Done', {status: 'Registration successfull!'});
		      	return res.status(200).json({status: 'Registration successfull!'});
		    });
		});
	},
	loginUser: function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
		    if (err) {
		    	winston.log('error', 'Login error', {err: err});
		     	return res.status(500).json({err: err});
		    }
		    if (!user) {
		    	winston.log('error', 'Login error', {err: 'No User Found!'});
		      	return res.status(404).json({err: 'No User Found!'});
		    }
		    req.logIn(user, function(err) {
		    	var response = function() {
		    		var resUser = {
						name: user.name,
						email: user.username,
						planlen: user.plan ? user.plan.length: 0,
						id: user._id,
						auth: user.authKey
					}
					winston.log('info', 'Login Done', {status: 'Login successfull!'});
			      	res.status(200).json({status: 'Login successfull!', user: resUser});
			    };

		      	if (err) {
		      		console.log(err);
		      		winston.log('error', 'Login error', {err: 'Could not log in user'});
		        	return res.status(401).json({err: 'Could not log in user'});
		      	}
		      	if(!user.authKey) {
		      		winston.log('info', 'Login with new token', {status: 'Login successfull!'});
		      		user.authKey = authenticate.createAuthToken();
		      		user.save(function (err, saved) {
						if (err) {
							res.send(err);
						}
						response();
					})
		      	} else {
		      		response();
		      	}
		    });
		})(req, res, next);
	},
	userLogout: function(req, res) {
		winston.log('info', 'Logout', {status: 'Logout!'});
		if(req.user) {
			users.find({username: req.user.username}, function(err, data) {	
				if(err) {
					console.log(err);
					res.send('Db error');
				}
				else {
					data[0].authKey = null;
					data[0].save(function (err) {
						if (err) {
							res.status(500).json({err: err, msg: 'Db Error'});
						}
						req.logout();
						res.status(200).json({err: null, msg: 'Successfully logged out!!'});
					})
				} 
			});	
		} else {
			//logout silently
			req.logout();
			res.status(200).json({err: null, msg: 'Successfully logged out!!'});
		}
	},
	userDelete: function(req, res) {
		users.find({ username: req.body['username'] }).remove(function(err) {
			if(err) console.log(err);
			res.status(204).json({status: 'Deleted User'})
		});
	},
	getUserDetailsDay: function(req, res) {
		var day = req.params['day'],
			name = req.params['uname'];
			
		users.find({username: name}, { plan: {$elemMatch: {day: day} } } , function(err, data) {	
			if(err) {
				console.log(err);
				res.send('Unknown db error');
			}
			else {
				if(data[0] && data[0].plan.length) {
					res.json(data[0].plan[0]);
				} else {				
					res.status(200).json({err: null, msg:'No Goals found'});
				}
			} 
		});	
	},
	
	addUserPlans : function(req, res) {
		var planObj = {},
			planToSave = req.body['plan'] ? req.body['plan']: req.body;

		users.find({username: req.params['uname']}, function(err, data) {
			if(err)
				return res.send(err);
			if(data.length) {
				var usr = data[0];
				
				if(usr && !usr.plan || !usr.plan.length) {
					//adding the first plan
					usr.plan = [];
					usr.plan.push(planToSave);
					usr.save(function (err, saved) {
						var value = _.result(_.find(saved.plan, {day: planToSave.day}), 'workout' ),
							len = value.length;
						if (err) {
							res.send(err);
						}
						else {
							res.status(201).send({planId: value[len - 1]._id, msg:'Created Plans'})
					   }
					})
				} else {	
					//add plan for days
					users.find({username: req.params['uname']}, function(err, data) {			
						var wrkot;
						if(data && data[0]) {
							for(var j=0; j<data[0].plan.length; j++) {
								if(data[0].plan[j].day == planToSave.day) {
									wrkot = data[0].plan[j].workout;
									break;
								}
							}
							if(wrkot) {
								var subdoc = wrkot.create(req.body.plan.workout);
								wrkot.push(subdoc);
								data[0].save(function(err, saved){
									if(err) res.send(err)
									else res.status(200).send({docId: subdoc._id, msg:'Added Workouts'})
								})
							} else {
								data[0].plan.push(planToSave);
								data[0].save(function (err, saved) {
									var value = _.result(_.find(saved.plan, {day: planToSave.day}), 'workout' ),
										len = value.length;

									if (err) {
										res.send(err);
									}
									else {
										res.status(201).send({planId: value[len - 1]._id, msg:'Added plans'})
								   }
								})
							}
						} else {
								users.update({username: req.params['uname'] }, {
								$addToSet: { 'plan': req.body['plan'] } },
								function(err) {
									(err) ?	res.send(err) :	res.status(200).send('Added plans!');
								}
							)
						}
					});
					
				}				
			} else {
				res.send('No data');
			}				
		})
	}, 
	updateUserPlans : function(req, res) {
		users.find({username: req.params['uname']}, function(err, data) {			
			planToSave = req.body.workout;
			var planOfDay, wrkot;
			if(data && data[0]) {
				for(var j=0; j<data[0].plan.length; j++) {
					if(data[0].plan[j].day == req.body.day) {
						wrkot = data[0].plan[j].workout;
						break;
					}
				}
				for(var i=0; i<wrkot.length; i++) {
					if(wrkot[i].name == planToSave.name) {
						wrkot[i].distance = planToSave.distance;
						wrkot[i].duration = planToSave.duration;
						break;
					}
				}
				data[0].save(function(err, updated){
					if(err) res.send(err)
					else res.status(200).send('updated!')
				})
			} else {
				res.status(404).json({err: 'UserNotFound', msg:'user not found'});
			}
		});
	},
	deleteUserWorkout: function(req, res) {
		var name = req.params.uname,
			day = req.query.day;

		users.find({username: name}, function(err, data) {			
			planToDel = req.body.workout;
			var planOfDay, wrkot;
			if(data && data[0]) {
				for(var j=0; j<data[0].plan.length; j++) {
					if(data[0].plan[j].day == day) {
						wrkot = data[0].plan[j].workout;
						break;
					}
				}
				for(var i=0; i<wrkot.length; i++) {
					if(wrkot[i].name == req.query.name) {
						wrkot.splice(i, 1)
						break;
					}
				}
				data[0].save(function(err){
					if(err) res.send(err)
					else res.status(204).send('Deleted!')
				})
			} else {
				res.send('user not found');
			}
		});
	},
	fb: {
		login: function(req, res) {
		},
		callback: function(req, res) {
			var user = req.user;
			winston.log('info', 'Facebook Callback Successfull');
			res.writeHead(302, {
				'Location': config.fb.locationRedirect+'/#/home?' + 
					'user=' + user.username + 
					'&displayName=' + user.facebook.name + 
					'&auth=' + user.authKey
			});
			res.end();
		}
	},
	google: {
		login: function(req, res) {
		},
		callback: function(req, res) {
			winston.log('info', 'Google Callback Successfull');
			var user = req.user;
			res.writeHead(302, {
				'Location': config.google.locationRedirect+'/#/home?' + 
					'user=' + user.username + 
					'&displayName=' + user.google.name + 
					'&auth=' + user.authKey
			});
			res.end();
		}
	}
}

module.exports = userCtrl;