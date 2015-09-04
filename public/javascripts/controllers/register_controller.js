
fitBit.controller('registerCtrl',  ['$scope', '$location', 'AuthService',  function ($scope, $location, AuthService) {
    $scope.register = function () {
        $scope.error = false;
        $scope.disabled = true;

      // call register from service
        AuthService.register($scope.registerForm.username, $scope.registerForm.password)
            .then(function () {
                $location.path('/login');
                $scope.disabled = false;
                $scope.registerForm = {};
            })
            // handle error
        .catch(function (err) {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
            $scope.registerForm = {};
        });

    };

}]);