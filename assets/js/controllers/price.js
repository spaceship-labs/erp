app.controller('priceCTL',function($scope,$http){
	$scope.prices = [];
	$scope.locations_ = locations_;
	$scope.transfers = transfers;
	$scope.airports = airports;
	$scope.companies = companies_;
	$scope.thelocation = thelocation_;
	$scope.isCollapsed = [];
	$scope.content = content;
    for(var i = 0;i<$scope.companies.length;i++){
        if($scope.companies[i].id==user.default_company)
            $scope.thecompany = $scope.companies[i];
    }
    $scope.getInfo = function(price){
        price.createdAt=(moment(price.createdAt).format('LL'));
        price.updatedAt=(moment(price.updatedAt).format('LL'));
        price.name = price.zone1.name + ' - ' + price.zone2.name;
        var r = {};
        r['Nombre'] = price.name;
        r['Company'] = price.company?price.company.name:'';
        r['Zona'] = price.zone1?price.zone1.name:'';
        r['Zona2'] = price.zone2?price.zone2.name:'';
        r['Created'] = price.createdAt;
        r['Updated'] = price.updatedAt;
        return r;
        
    };
    $scope.updatePrices = function(req,res){
    	params = { location : $scope.thelocation.id , company : $scope.thecompany.id , transfer : $scope.thetransfer.id };
    	$http({method: 'POST', url: '/transferprice/getPrices',params:params }).success(function (prices){
			$scope.prices = prices;
			//$scope.companies = addPricesOnCompany($scope.companies,prices);
        });
    }
    $scope.savePrice = function(data,price){
    	angular.extend(data, { id : price });
    	return $http.post('/transferprice/updatePrice', data);
    }
    $scope.sortByField = function(field){
    	for( i in $scope.prices ){
    		$scope.prices[i].sort(function(a,b){
    			if( field != 'active' ){
    				var item1 = a[field].name.toLowerCase(), 
    					item2 = b[field].name.toLowerCase();
    			}else{
    				var item1=!a[field], item2=!b[field];
    			}
    			if (item1 < item2) //ASC
					return -1 
				if (item1 > item2) //DESC
					return 1
				return 0
    		});
    	}
    }
    $scope.closeTransfers = function(){
    	var i = 0;
    	for( x in $scope.prices ){
    		$scope.isCollapsed.push(true);
    	}
    	$scope.isCollapsed[0] = false;
    	//console.log($scope.isCollapsed);
    }
    $scope.closeTransfers();
    $scope.isFCollapsed = function(index){
    	//console.log($scope.isCollapsed[index]);
    	$scope.isCollapsed[index] = !$scope.isCollapsed[index];
    }
    $scope.getCollapsed = function(index){
    	return $scope.isCollapsed[index];
    }
    //$scope.closeTransfers();
    $scope.generatePrices = function(company,transfer){
        if( company && transfer ){
            var params = { companyID : company.id , transferID : transfer.id };
            console.log(params);
            $http({method: 'POST', url: '/transferprice/createCustom',params:params }).success(function (prices){
                console.log('Resultado de crear los precios');
                console.log(prices);
                //$scope.prices = prices;
                //$scope.companies = addPricesOnCompany($scope.companies,prices);
            });
        }
    }
});
