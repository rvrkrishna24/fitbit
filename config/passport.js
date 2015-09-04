var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');
var configAuth = require('./config.js');
var util = require('../app/controllers/util');
var crypt = require('../app/controllers/util');
var winston = require('winston');

var authenticate = require('./authenticate.js');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID        : configAuth.fb.app_id,
        clientSecret    : configAuth.fb.app_secret,
        callbackURL     : configAuth.fb.callbackURL,
        profileFields   : ['displayName','emails']
    },

    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ username : profile.emails[0].value }, function(err, user) {
                if (err) {
                    winston.log('error', 'Facebook', {err: err});
                    return done(err);
                }
                if (user) {
                    winston.log('info', 'Facebook', {status: 'User already present'});
                    user.facebook = {
                        id: profile.id,
                        token: token,
                        email: profile.emails[0].value,
                        refreshToken: refreshToken,
                        name: profile.displayName || profile.emails[0].value.split('@')[0]
                    }
                    user.authKey =authenticate.createAuthToken();
		            user.save(function(err) {
                        if (err){
                            winston.log('error', 'Facebook', {err: err});
                            return done(err);
                        }
                        winston.log('info', 'Facebook', {status: 'User entry updated with facebook info!'})
                        return done(null, user);
		            });
                } else {
                    var newUser = new User();
                    newUser.facebook = {
                        id: profile.id,
                        token: token,
                        email: profile.emails[0].value || profile.displayName,
                        refreshToken: refreshToken,
                        name: profile.displayName || profile.emails[0].value.split('@')[0],
                    }
                    newUser.authKey = authenticate.createAuthToken();
                    newUser.username = profile.emails[0].value || profile.displayName
                    newUser.save(function(err) {
                        if (err) {
                            winston.log('error', 'Facebook', {err: err})
                            return done(err);
                        }
                        winston.log('info', 'Facebook', {status: 'User entry for facebook done'});
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    passport.use(new GoogleStrategy({
        clientID        : configAuth.google.client_id,
        clientSecret    : configAuth.google.client_secret,
        callbackURL     : configAuth.google.callbackURL
    },
    function(token, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function() {
            User.findOne({ username : profile.emails[0].value }, function(err, user) {
                if (err) {
                    winston.log('error', 'Google', {err: err})
                    return done(err);
                }
                if (user) {
                    winston.log('error', 'Google', {status: 'User entry already present!'})
                    user.google = {
                        id: profile.id,
                        token: token,
                        email: profile.emails[0].value || profile.displayName,
                        name: profile.displayName
                    }
                    user.authKey = authenticate.createAuthToken();
		            user.save(function(err) {
                        if (err){
                            winston.log('error', 'Google', {err: err});
                            return done(err);
                        }
                        winston.log('info', 'Google', {status: 'User entry updated with google info!'})
                        return done(null, user);
                    });
                } else {
                    var newUser          = new User();
                    newUser.google = {
                        id: profile.id,
                        token: token,
                        email: profile.emails[0].value || profile.displayName,
                        name: profile.displayName
                    }
                    newUser.authKey = authenticate.createAuthToken();
                    newUser.username = profile.emails[0].value || profile.displayName
                    newUser.save(function(err) {
                        if (err){
                            winston.log('error', 'Google', {err: err});
                            return done(err);
                        }
                        winston.log('info', 'Google', {status: 'User entry added!'})
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

};
