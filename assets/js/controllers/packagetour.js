app.controller('packageCTL',function($scope,$http){
	$scope.packages = packages;
	$scope.content = content;
	$scope.createPackage = function(newPackage){
		$http({method: 'POST', url: '/packagetour/create',params:newPackage}).success(function (package_){
            $scope.packages.push(package_);
            jQuery('#myModal').modal('hide');
        });
	}
});
app.controller('packageEditCTL',function($scope,$http){
	$scope.package_t = package_t;
	$scope.items = items;
	$scope.locations = locations;
	$scope.content = content;
	$scope.isCollapsed = true;
	$scope.collapsableClass = 'fa-plus';
	$scope.hiddenFields = [
        { key : 'type' , value : 'day' },
        { key : 'package_' , value : $scope.package_t.id }
    ];
	$scope.collapseToggle = function(){
		$scope.isCollapsed = !$scope.isCollapsed;
		$scope.collapsableClass = $scope.isCollapsed?'fa-plus':'fa-minus';
		console.log($scope.isCollapsed);
		console.log($scope.collapsableClass);
	}
	$scope.addDay = function(newDay){
		$http({method: 'POST', url: '/packageitem/create',params:newDay}).success(function (day){
            $scope.package_t.items.push(day);
            $scope.aply();
        });
	}
	$scope.updateDays = function(){
		$scope.daysnumber = [];
		for(var i = 1; i< 20; i++){
			$scope.daysnumber.push(i+'');
		}
		console.log($scope.daysnumber);
		var items = $scope.package_t.items;
		if( items ){
			for(var x in items){
				var index = $scope.daysnumber.indexOf(items[x].day);
				if( index != -1 ) {
					$scope.daysnumber.splice(index,1);
				};
			}
			console.log($scope.daysnumber);
		}
	}
	$scope.updateDays();
});
app.controller('packageItemEditCTL',function($scope,$http){
	$scope.content = content;
	$scope.item = item;
	$scope.locations = locations;
	$scope.daysnumber = [];
	for(var i = 1; i< 20; i++){
		$scope.daysnumber.push(i+'');
	}
});