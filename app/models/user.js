var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var wrkout = new Schema({
	name: String,
	distance: {
		plan: Number,
		train: Number
	},
	duration: {
		plan: Number,
		train: Number
	},
	image:String
});

var plan = new Schema({
	day:  String,
	workout: [wrkout]
});

var user = new Schema({
    username: String,
    password: String,
    name: String,
    authKey: String,
    facebook: {
		id: String,
		token: String,
		email: String,
		refreshToken: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		refreshToken: String,
		name: String
	},
    plan: [plan]
});

user.pre('save', function(next) {
	//this.name = 'user'+parseInt(Math.random()*10000, 10);
	if(this.username)
		this.name = this.username.split('@')[0];
	next();
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", user);