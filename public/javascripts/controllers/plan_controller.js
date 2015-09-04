fitBit.controller('planCtrl',  ['$scope', '$state','request', 'requrls', '$timeout', function($scope, $state, request, requrls, $timeout) {	
	var plan = request.get(requrls['plan_per_day']);
	plan.then(
		function(planData){
			if(planData && planData.workout) {

				$state.go('home.plan.list')
			}
			else {
				$scope.info = 'Please Add Plans';
				$timeout(function(){ $scope.info = ''; }, 3000)
				$state.go('home.plan.add')
			}
		}, 
		function(err){
			$state.go('home.plan.add');
			$scope.info = err.msg;
			$timeout(function(){ $scope.info = ''; }, 3000)
		}
	)
}]);
	