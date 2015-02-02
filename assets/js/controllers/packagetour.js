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
	$scope.content = content;
	$scope.isCollapsed = true;
	$scope.collapsableClass = 'fa-plus';
	$scope.collapseToggle = function(){
		$scope.isCollapsed = !$scope.isCollapsed;
		$scope.collapsableClass = $scope.isCollapsed?'fa-plus':'fa-minus';
		console.log($scope.isCollapsed);
		console.log($scope.collapsableClass);
	}
	$scope.addDay = function(newDay){
		$http({method: 'POST', url: '/packagetour/update',params:newPackage}).success(function (package_){
            $scope.packages.push(package_);
            jQuery('#myModal').modal('hide');
        });
	}
});