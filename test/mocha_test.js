var should = require('should');
var request = require('request');
var crypto = require("crypto");

var baseUrl = 'http://ec2-52-76-44-231.ap-southeast-1.compute.amazonaws.com:3000/';
//var baseUrl = 'http://localhost:3000/';
var email = crypto.randomBytes(5).toString('hex') + '@' + crypto.randomBytes(5).toString('hex') +'.cc';

var dayArr = ['Sunday', 'Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
	day = dayArr[(new Date()).getDay()];

var authToken;

var resource = {
    "plan": {
        "workout": {
            "distance": {
                "plan": 20,
                "train": 4
            },
            "duration": {
                "plan": 30,
                "train": 4
            },
            "image": "Walking.jpg",
            "name": "Walking"
        },
        "day": day
    }
},
updateResource = {
    "plan": {
        "workout": {
            "distance": {
                "plan": 300,
                "train": 400
            },
            "duration": {
                "plan": 30,
                "train": 50
            },
            "image": "Walking.jpg",
            "name": "Walking"
        },
        "day": day
    }
};


describe('Test plans for FitBit App', function() {
	this.timeout(0);
	it('Check server url - should return 200', function (done) {
		request.get(baseUrl, function (err, res, body) {
		    res.statusCode.should.equal(200);
		    done();
		});
	});	

	it('Register a User -- 200 through local--', function (done) {
		request.post( {url: baseUrl + 'user/register', form: {username: email, password: 'testabcd'} }, function (err, res, body) {
			var data = JSON.parse(body);
		    res.statusCode.should.equal(200);
		    data.should.be.an.Object;
		    data.status.should.be.equal('Registration successfull!');
		    done();
		});
	});

	it('Login a User -- 200 through local--', function (done) {
		request.post( {url: baseUrl + 'user/login', form: {username: email, password: 'testabcd'} }, function (err, res, body) {
			var data = JSON.parse(body);
		    res.statusCode.should.equal(200);
		    data.should.be.an.Object;
		    authToken = data.user.auth;
		    done();
		});
	});

	it('Login with an not registered User -- 404 through local--', function (done) {
		request.post( {url: baseUrl + 'user/login', form: {username: 'abcdefg@jjj.cc', password: 'testabcd'} }, function (err, res, body) {
			var data = JSON.parse(body);
		    res.statusCode.should.equal(404);
		    data.should.be.an.Object;
		    data.err.should.be.equal('No User Found!');
		    done();
		});
	});

	
	it('Add a resource/day -- should be 201', function (done) {
		request({ 
				url: baseUrl + 'users/'+email, 
				method: 'POST', 
				json: resource, 
				headers: {
	                'Accept' : 'application/json',
	                'content-type' : 'application/json',
	                'Authorization': authToken
	            }
        	}, function (err, res, body) {
			    res.statusCode.should.equal(201);
			    body.should.be.an.Object;
			    done();
			}
		);
	});	


	it('Check for added day -- should be 200', function (done) {
		request(
			{ 
				url: baseUrl + 'users/'+email+'/'+day, 
				method: 'GET',
				headers: {
	                'Accept' : 'application/json',
	                'content-type' : 'application/json',
	                'Authorization': authToken
	            }
	        },
			function (err, res, body) {
			    res.statusCode.should.equal(200);
			    done();
			}
		);
	});	


	it('Add a workout -- should be 200', function (done) {
		request({ 
				url: baseUrl + 'users/'+email, 
				method: 'POST', 
				json: updateResource, 
				headers: {
	                'Accept' : 'application/json',
	                'content-type' : 'application/json',
	                'Authorization': authToken
	            }
        	}, function (err, res, body) {
			    res.statusCode.should.equal(200);
			    body.should.be.an.Object;
			    done();
			}
		);
	});	

	it('Get for a unknown resource -- No Goals', function (done) {
		var day = 'Sunday';
		request(
			{ 
				url: baseUrl + 'users/'+email+'/'+day, 
				method: 'GET',
				headers: {
	                'Accept' : 'application/json',
	                'content-type' : 'application/json',
	                'Authorization': authToken
	            }
	        },
			function (err, res, body) {
				var data = JSON.parse(body);
			    res.statusCode.should.equal(200);
			    data.should.be.an.Object;
		    	data.msg.should.be.equal('No Goals found');
			    done();
			}
		);
	});	

	it('Delete the resource -- should be 401, no Tokens ', function (done) {
		request(
			{ 
				url: baseUrl + 'users/'+email+'/?day='+day+'&name=Walking', 
				method: 'DELETE',
				headers: {
	                'Accept' : 'application/json',
	                'content-type' : 'application/json'
	            },

	        },
			function (err, res, body) {
				var data = JSON.parse(body);
			    data.should.be.an.Object;
		    	data.err.should.be.equal('UnauthorizedError');
			    res.statusCode.should.equal(401);
			    done();
			}
		);
	});	

	it('Delete the resource -- should be 204 ', function (done) {
		request(
			{ 
				url: baseUrl + 'users/'+email+'/?day='+day+'&name=Walking', 
				method: 'DELETE',
				headers: {
	                'Accept' : 'application/json',
	                'content-type' : 'application/json',
	                'Authorization': authToken
	            },

	        },
			function (err, res, body) {
			    res.statusCode.should.equal(204);
			    done();
			}
		);
	});	

	it('Delete the user 204--', function (done) {
		request.del( {url: baseUrl + 'user', form: {username: email} }, function (err, res, body) {
		    res.statusCode.should.equal(204);
		    done();
		});
	});
})