fitBit.controller('logoutCtrl',  ['$window','$scope', '$location', 'AuthService', 'request', '$localStorage', 'requrls', function ($window, $scope, $location, AuthService, request, $localStorage, requrls) {
    $localStorage.$reset();
    AuthService.logout()
        .then(function () {
        	$window.location.reload(true);
            $location.path('/login');
        });
}]);