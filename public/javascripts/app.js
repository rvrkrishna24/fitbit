var fitBit = angular.module('fitBit',['ui.router','chart.js','ui.bootstrap', 'ngRoute', 'ngCookies', 'ngStorage','ngTouch']);

fitBit.config(['$stateProvider','$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	    $urlRouterProvider.otherwise('/login');
	
		$stateProvider
		.state('home', {
            url: '/home?auth&user&displayName',
            templateUrl: 'partials/home.html',
			controller : 'homeCtrl',
			access: {restricted: true}
        })
		
		.state('login', {
            url: '/login',
            templateUrl: 'partials/user/login.html',
			controller : 'loginCtrl',
			access: {restricted: false}
        })

        .state('logout', {
            url: '/logout',
			controller : 'logoutCtrl',
			access: {restricted: false}
        })

        .state('register', {
            url: '/register',
            templateUrl: 'partials/user/register.html',
			controller : 'registerCtrl',
			access: {restricted: false}
        })

		.state('home.plan', {
			url		   : '/plan',
			templateUrl: 'partials/plans/plan.html',
			controller: 'planCtrl',
			access: {restricted: true}
		})
		
		.state('home.plan.add', {
	        url: '/add',
	        templateUrl: 'partials/plans/addPlans.html',
	        controller:'planAddCtrl',
			access: {restricted: true}
		})
		
		.state('home.plan.list', {
	        url: '/list',
	        templateUrl: 'partials/plans/listPlans.html',
	        controller:'planListCtrl',
			access: {restricted: true}
		})
		
		.state('home.plan.edit', {
	        url: '/edit',
	        templateUrl: 'partials/plans/editPlans.html',
	        controller:'planEditCtrl',
			access: {restricted: true}
		})
		
		.state('home.train',{
			url		   : '/train',
			templateUrl:'partials/train.html',
			controller :'trainCtrl',
			access: {restricted: true}
		})
		
		.state('home.analyze',{
			url		   : '/analyze',
			templateUrl:'partials/analyze.html',
			controller :'analyzeCtrl'
		})
		
		.state('home.analyze.lineChart',{
			url		   : '/analyze',
			templateUrl:'partials/analyze/lineChart.html',
			controller :'analyzeLineCtrl'
		})
		
		.state('home.analyze.barChart',{
			url		   : '/analyze',
			templateUrl:'partials/analyze/barChart.html',
			controller :'analyzeBarCtrl'
		})

}]);


fitBit.run(function ($rootScope, $location, AuthService, $http, $state) {
	$rootScope.$on('$stateChangeStart', function (event, next, current) {
	    if (next.access.restricted && AuthService.isLoggedIn() === false && $location.path().indexOf('auth') != -1) {
		    event.preventDefault();
		    $state.go('login');
	    }
	    $http.defaults.headers.common.Authorization = AuthService.getToken();
	});
});