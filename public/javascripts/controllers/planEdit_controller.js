fitBit.controller('planEditCtrl',  ['$scope', 'request', 'enableSettings', 'requrls', 'days', '$state', function($scope, request, enableSettings, requrls, days, $state) {
		$scope.edit = enableSettings.enableEdit;
		var plan = request.get(requrls['plan_per_day']);
		plan.then(
			function(planData){
				if(planData && planData.workout) {
					$scope.workoutsEdit = planData.workout;
				}
				else {
					$scope.info = 'No data!!';
				}
			}, 
			function(err){
				$scope.info = err.msg;
			}
		);

		$scope.deleteRow = function(activity){
			var postDataDelete ={
				day: days.day,
				name: activity
			};
			var del = request.delete(requrls.delete_workout, {params: postDataDelete});
			del.then(
				function(data) {
					console.log(data);
					$state.go('home.plan.list');
				},
				function(err) {
					console.log(err);
				}
			)
		}
		
		$scope.save = function(index){
			var postData = {
				day : days.day,
				workout : $scope.workoutsEdit[index]
			};
			var updateData = request.update(requrls.update_workout, postData);
			updateData.then(
				function(data) {
					console.log(data);
				}, 
				function(err) {
					console.log(err);
				}	
			);			
		};
}]);
