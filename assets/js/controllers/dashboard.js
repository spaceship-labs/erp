app.controller('dashboardCTL',function($scope,$http){
	$scope.getStats = function(){
		$scope.stats = {};
		$scope.stats.data = [100,200,300];
		$scope.stats.labels = ['Label A','Label B','Label C'];
		
		$scope.dayDate = new Date();
	}
	$scope.getStats();
});