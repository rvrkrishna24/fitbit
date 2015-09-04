fitBit.factory('request', function($q, $http){
	//req of some url should return the data in some defer type of things
	return {
		get: function(url, paramsObj) {
			var deferred = $q.defer();
			$http.get(url)
				.success(function(data) {
					deferred.resolve(data);
				})
				.error(function(err){
					deferred.reject(err);
				})
			return deferred.promise
		},
		post: function(url, body) {
			var deferred = $q.defer();
			$http.post(url, body)
				.success(function(data) {
					deferred.resolve(data);
				})
				.error(function(err){
					deferred.reject(err);
				})
			return deferred.promise
		},
		update: function(url, body) {
			var deferred = $q.defer();
			$http.put(url, body)
				.success(function(data) {
					deferred.resolve(data);
				})
				.error(function(err){
					deferred.reject(err);
				})
			return deferred.promise
		},
		delete: function(url, body) {
			var deferred = $q.defer();
			$http.delete(url, body)
				.success(function(data) {
					deferred.resolve(data);
				})
				.error(function(err){
					deferred.reject(err);
				})
			return deferred.promise
		}
	}
})

fitBit.factory('days', function() {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return {
		values: days,
		day : days[(new Date()).getDay()]
	}
})

fitBit.factory('requrls', function(AuthService, days) {
	var uname = AuthService.getUserStatus();
	return {
		plan_per_day: 'users/'+uname+'/'+days.day,
		add_plan: 'users/'+uname,
		update_workout: '/users/'+uname,
		delete_workout: '/users/'+uname,
		logout_user: '/user/logout'
	}
})

fitBit.factory('enableSettings', function() {
	return {
		enableEdit: ''
	}
})

fitBit.factory('AuthService', ['$q', '$timeout', '$http', '$localStorage',function ($q, $timeout, $http, $localStorage) {

    var user = null;
    return ({
	    isLoggedIn: isLoggedIn,
	    getUserStatus: getUserStatus,
	    login: login,
	    logout: logout,
	    register: register,
	    getToken: getToken
    });

    function isLoggedIn() {
        return getUserStatus() ? true: false;
    }

    function getUserStatus() {
      return $localStorage.user;
    }

    function getToken() {
    	return $localStorage.auth;
    }

    function login(username, password) {
	    var deferred = $q.defer();

      	$http.post('/user/login', {username: username, password: password})
        .success(function (data, status) {
        	console.log(data);
	        if(status === 200 && data.status){
	            $localStorage.user = data.user.email;
		    	$localStorage.displayName = data.user.name;
		    	$localStorage.auth = data.user.auth;
	            deferred.resolve();
	        } else {
	            user = false;
	            deferred.reject();
	        }
        })
        // handle error
        .error(function (data) {
          	user = false;
          	deferred.reject();
        });
      return deferred.promise;
    }

    function logout() {
	    var deferred = $q.defer();
      	$http.get('/user/logout')
	        .success(function (data) {
	          	user = false;
	          	$localStorage.$reset();
	          	deferred.resolve(data.msg);
	        })
	        .error(function (data) {
	          	user = false;
	          	deferred.reject();
	        });
      return deferred.promise;

    }

    function register(username, password) {
	    var deferred = $q.defer();
	    $http.post('/user/register', {username: username, password: password})
    	    .success(function (data, status) {
	          	if(status === 200 && data.status){
	            	deferred.resolve();
	          	} else {
	            	deferred.reject();
	          	}
	        })
        .error(function (data) {
	        deferred.reject();
        });
      return deferred.promise;

    }

}]);