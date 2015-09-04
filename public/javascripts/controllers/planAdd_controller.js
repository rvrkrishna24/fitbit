fitBit.controller('planAddCtrl',  ['$scope', 'request', '$timeout', 'requrls', 'days', function($scope, request, $timeout, requrls, days) {
	$scope.days = days.values;
	$scope.selectedDay=$scope.days[0];
	$scope.activities = ['Select','Walking','Jogging','Running','Skating','Cycling'];
	$scope.selectedActivity=$scope.activities[0];
	$scope.selectedDistance=0;
	$scope.selectedDuration=0;
	$scope.addPlan = { plan: {workout:{distance:{},duration:{}}} };
	
	var random = function(value) {
		return Math.floor((Math.random() * value) + 1)
	}
	
	$scope.add = function(){
		if($scope.selectedDay!="Select" && $scope.selectedActivity!="Select" && $scope.selectedDistance!="0" && $scope.selectedDuration!="0"){
			$scope.info="";
			$scope.addPlan.plan.workout.image = $scope.selectedActivity+'.jpg';
			$scope.addPlan.plan.day = $scope.selectedDay;

			//$scope.addPlan.plan.workout.distance.train = random($scope.addPlan.plan.workout.duration.plan);
			//$scope.addPlan.plan.workout.duration.train = random($scope.addPlan.plan.workout.duration.plan);
			//$scope.addPlan.plan.workout.distance.train = random($scope.addPlan.plan.workout.duration.plan);
			//$scope.addPlan.plan.workout.duration.train = random($scope.addPlan.plan.workout.duration.plan);
			$scope.addPlan.plan.workout.name = $scope.selectedActivity;
			$scope.addPlan.plan.workout.distance.plan = $scope.selectedDistance;
			$scope.addPlan.plan.workout.duration.plan = $scope.selectedDuration;
			$scope.addPlan.plan.workout.distance.train = random($scope.selectedDistance);
			$scope.addPlan.plan.workout.duration.train =random($scope.selectedDuration);
			var postPlan = request.post(requrls['add_plan'], $scope.addPlan);

			postPlan.then(
				function(data) {
					$scope.info = data.msg;
					$timeout(function(){ $scope.info = ''; }, 3000)
				}, 
				function(err) {
					$scope.info = err;
				}	
			);			
		}else{
			$scope.info="Fill Empty Fields";
		}
	}
}]);
