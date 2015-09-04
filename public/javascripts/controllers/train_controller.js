fitBit.controller('trainCtrl',  ['$scope', 'request', 'requrls', function($scope, request, requrls) {

	var userDetails = request.get(requrls['plan_per_day']);
	userDetails.then(
		function(user_data) {
			if(user_data && user_data.workout) {
				console.log(user_data);
				$scope.workouts = user_data.workout;
			}
			else {
				$scope.info = 'No data!!';
			}
		}, 
		function(err){
			$scope.info = err.msg;
		}
	)
	
	$scope.share = function() {	
		var fb = request.get('/fblogin');
		fb.then(
			function(data) { 
				window.location = data.url;
			}, 
			function(err) { 
				console.log(err);
			}
		)
	}
	
    $scope.activity = function(activityName) {
		var clickedData = $scope.workouts.filter(function(data) { return data.name == activityName});	
		$scope.activityDet = {
			name: activityName,
			distance: clickedData[0].distance,
			duration: clickedData[0].duration
		};
		//angular-chart values
		$scope.data = [ $scope.activityDet.distance.train , $scope.activityDet.distance.plan- $scope.activityDet.distance.train];
		$scope.labels = ['Trained', 'Left'];
	}
}]);
