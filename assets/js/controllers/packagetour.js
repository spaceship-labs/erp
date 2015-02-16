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
	$scope.themarkers = {}
	$scope.locations = locations;
	$scope.content = content;
	$scope.isCollapsed = true;
	$scope.collapsableClass = 'fa-plus';
	$scope.hiddenFields = [
        { key : 'type' , value : 'day' },
        { key : 'package_' , value : $scope.package_t.id }
    ];
    if($scope.items.length>0){
    	for(var i=0;i<$scope.items.length;i++){
    		for(var x in items[i].markers){
    			$scope.themarkers[i + x] = items[i].markers[x];
    		}
    	}
    }
    $scope.center = {
        lat : 21.1667,
        lng : -86.8333,
        zoom : 6
    };
	$scope.collapseToggle = function(){
		$scope.isCollapsed = !$scope.isCollapsed;
		$scope.collapsableClass = $scope.isCollapsed?'fa-plus':'fa-minus';
		//console.log($scope.isCollapsed);
		//console.log($scope.collapsableClass);
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
		//console.log($scope.daysnumber);
		var items = $scope.package_t.items;
		if( items ){
			for(var x in items){
				var index = $scope.daysnumber.indexOf(items[x].day);
				if( index != -1 ) {
					$scope.daysnumber.splice(index,1);
				};
			}
			//console.log($scope.daysnumber);
		}
	}
	$scope.updateDays();
});
app.controller('packageItemEditCTL',function($scope,$http){
	$scope.content = content;
	$scope.item = item;
	$scope.item.markers = item.markers || {};
	$scope.locations = locations;
	$scope.location_ = location_;
	$scope.daysnumber = [];
	for(var i = 1; i< 20; i++){
		$scope.daysnumber.push(i+'');
	}
	$scope.updateMarkers = function(markers,cb){
		//console.log($scope.item);
		//console.log(markers);
		var data = { id : $scope.item.id , markers : markers };
		//console.log(data);
		$http({method: 'POST', url: '/packageitem/update',params:data}).success(function (item){
            $scope.item = item;
            cb(null,item);
        });
	};
	$scope.center = {
        lat : 21.1667,
        lng : -86.8333,
        zoom : 6
    };
});