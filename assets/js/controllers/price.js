app.controller('priceCTL',function($scope,$http){
	$scope.prices = prices;
	$scope.services = services;
	$scope.airports = airports;
	$scope.companies = companies;
	$scope.zones = zones;
	$scope.content = content;

	$scope.myservice = services[0];
	$scope.myairport = airports[0];
	$scope.createPrice = function(newPrice){
        $http({method: 'POST', url: '/price/create',params:newPrice}).success(function (price){
            $scope.prices.push(price);
            jQuery('#myModal').modal('hide');
        });
    };

});