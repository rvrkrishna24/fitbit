fitBit.controller('homeCtrl',  ['$scope', 'AuthService', '$stateParams', '$localStorage', '$state', '$location', function($scope, AuthService, $stateParams, $localStorage, $state, $location) {	

	if($stateParams.user && $stateParams.auth) {
		$localStorage.displayName = $stateParams.displayName;
		$localStorage.user = $stateParams.user;
		$localStorage.auth = $stateParams.auth;
		$location.search('');
	}	

	$scope.uname = $localStorage.displayName || AuthService.getUserStatus();
	// $scope.logout = function() {
	// 	$localStorage.$reset();
	// 	$state.go('login');
	// }
	//public_profile
}]);

