fitBit.controller('loginCtrl',  ['$scope', '$location', 'AuthService',  function ($scope, $location, AuthService) {
    $scope.login = function () {
        $scope.error = false;
        $scope.disabled = true;

        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
            // handle success
            .then(function () {
                $location.path('/home');
                $scope.disabled = false;
                $scope.loginForm = {};
            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Invalid username and/or password";
                $scope.disabled = false;
                $scope.loginForm = {};
            });
        };


        $scope.register = function () {
        $scope.error = false;
        $scope.disabled = true;
        $scope.success=false;
        $scope.registerSuccessMsg="Registered Successfully";

      // call register from service
        AuthService.register($scope.registerForm.username, $scope.registerForm.password)
            .then(function () {
                $location.path('/login');
                $scope.disabled = false;
                $scope.registerForm = {};
                $scope.success=true;
            })
            // handle error
        .catch(function (err) {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
            $scope.registerForm = {};
        });
    }

    $scope.tabChange=function(tab){
        $scope.error=false;
        $scope.success=false;
        if(tab=='tab1'){
	 if($scope.loginForm){
            $scope.loginForm.username="";
            $scope.loginForm.password="";
        }}
        else if(tab=='tab2'){
            if($scope.registerForm) {
                $scope.registerForm.username="";
                $scope.registerForm.password="";
            }
        }
        else if(tab=='tab3'){

        }
        else if(tab=='tab4'){

        }
    }
}]);