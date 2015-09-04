fitBit.controller('planListCtrl',  ['$scope', '$state','request', 'enableSettings', 'requrls',function($scope, $state, request, enableSettings, requrls) {	
	var plan = request.get(requrls['plan_per_day']);
	plan.then(
		function(planData){
			if(planData && planData.workout) {
				$scope.workouts = planData.workout;
				console.log($scope.workouts);
			}
			else {
				$scope.info = 'No data!! Add New Plans';
			}
		}, 
		function(err){
			$scope.info = err.msg;
		}
	)
	$scope.moreInfo = function(inx) {
		$state.go('home.train');
	}

	$scope.enableEdit = function(val) {
		enableSettings.enableEdit = val;
	}

}]);
