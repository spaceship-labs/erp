app.controller('priceCTL',function($scope,$http){
	$scope.prices = prices;
	$scope.services = services;
	$scope.airports = airports;
	$scope.companies = companies_;
	$scope.zones = zones;
	$scope.content = content;

	$scope.myservice = services[0];
	$scope.myairport = airports[0];
	$scope.mycompany = companies_[0];
	$scope.createPrice = function(newPrice){
        $http({method: 'POST', url: '/price/create',params:newPrice}).success(function (price){
        	if( price.airport == $scope.myairport.id && price.service == $scope.myservice.id )
            	$scope.prices.push(price);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.updatePrices = function(req,res){
    	params = { company : $scope.mycompany.id , service : $scope.myservice.id , airport : $scope.myairport.id };
    	$http({method: 'POST', url: '/price/getPrices',params:params }).success(function (prices){
			$scope.prices = prices;
			$scope.companies = addPricesOnCompany($scope.companies,prices);
        });
    }
    $scope.savePrice = function(data,price){
    	angular.extend(data, { id : price });
    	return $http.post('/price/updatePrice', data);
    }

});
function addPricesOnCompany( companies , prices ){
	for( i in companies ){
		companies[i].prices = [];
		for( j in prices ){
			if( prices[j].company == companies[i].id )
				companies[i].prices.push( prices[j] );
		}
	}
	return companies;
}