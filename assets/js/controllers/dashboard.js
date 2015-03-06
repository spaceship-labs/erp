app.controller('dashboardCTL',function($scope,$http){
	$scope.getReservationsStats = function(){
		$http.post('/reservation/statsCategories').success(function(response){
			console.log(response);
		});
	}
	$scope.getReservationsStats();
});