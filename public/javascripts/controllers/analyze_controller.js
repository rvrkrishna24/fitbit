fitBit.controller('analyzeLineCtrl',  ['$scope', '$http',	function($scope, $http) {
  $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  $scope.series = ['Walking', 'Jogging','Cycling','Skating'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
	[20, 40, 40, 0, 15, 65, 90],
	[18, 53, 30, 71, 24, 51, 40]
  ];
}]);

fitBit.controller('analyzeBarCtrl',  ['$scope', '$http',	function($scope, $http) {
  $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  $scope.series = ['Trained', 'Planned'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
}]);


fitBit.controller('analyzeCtrl',  ['$scope', '$http',	function($scope, $http) {
	  $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  $scope.series = ['Walking', 'Jogging','Cycling','Skating'];

  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
	[20, 40, 40, 0, 15, 65, 90],
	[18, 53, 30, 71, 24, 51, 40]
  ];



}]);