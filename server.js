var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	http = require('http'),
	config = require('./config/config'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	winston = require('winston');

var passport = require('passport'),
 	LocalStrategy = require('passport-local').Strategy;

var user = require('./app/models/user');

winston.add(winston.transports.File, { filename: 'logallerrors.log' });
winston.remove(winston.transports.Console);

var app = express();

var connectToDb = function () {
  	var options = { server: { socketOptions: { keepAlive: 1 } } };
  	mongoose.connect(config.db, options);
};
connectToDb();

mongoose.connection.on('error', function(err){ console.log('Error: '+err) });
mongoose.connection.on('disconnected', connectToDb);

require('./config/passport')(passport); // pass passport for configuration

//set envs
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: 'neededforpassport', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


// passport config
passport.use(new LocalStrategy(user.authenticate()));

var routes = require('./config/routes');

app.use('/', routes);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  	console.log('Express server listening on port ' + app.get('port'));
});
