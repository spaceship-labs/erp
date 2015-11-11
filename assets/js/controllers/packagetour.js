app.controller('packageCTL',function($scope,$http){
	$scope.packages = packages;
	$scope.content = content;
	$scope.createPackage = function(newPackage){
		$http({method: 'POST', url: '/packagetour/create',params:newPackage}).success(function (package_){
            $scope.packages.push(package_);
            jQuery('#myModal').modal('hide');
            window.location.reload();
        });
	}
});
app.controller('packageEditCTL',function($scope,$http,$rootScope){
	$scope.package_t = package_t;
	$scope.user = user;
	$scope.items = items;
	$scope.themarkers = {}
	$scope.thehotels = {}
	$scope.locations = locations;
	$scope.categories = [
        {id:1,name:'1 '+$rootScope.translates.c_stars},
        {id:2,name:'2 '+$rootScope.translates.c_stars},
        {id:3,name:'3 '+$rootScope.translates.c_stars},
        {id:4,name:'4 '+$rootScope.translates.c_stars},
        {id:5,name:'5 '+$rootScope.translates.c_stars},
        {id:6,name:'6 '+$rootScope.translates.c_stars},
    ];
	$scope.content = content;
	$scope.isCollapsed = true ; $scope.isCollapsed2 = true;
	$scope.collapsableClass = 'fa-plus';
	$scope.hiddenFields = [
        { key : 'type' , value : 'day' },
        { key : 'package_' , value : $scope.package_t.id }
    ];
    $scope.hiddenFieldsH = [
        { key : 'type' , value : 'hotel' },
        { key : 'package_' , value : $scope.package_t.id }
    ];
    if($scope.items.day && $scope.items.day.length>0){
    	for(var i=0;i<$scope.items.day.length;i++){
    		for(var x in $scope.items.day[i].markers){
    			$scope.themarkers[i + x] = $scope.items.day[i].markers[x];
    		}
    	}
    }else{
    	$scope.items.day = [];
    }
    if($scope.items.hotel && $scope.items.hotel.length>0){
    	for(var i=0;i<$scope.items.hotel.length;i++){
    		for(var x in $scope.items.hotel[i].markers){
    			$scope.thehotels[i + x] = $scope.items.hotel[i].markers[x];
    		}
    	}
    }else{
    	$scope.items.hotel = [];
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
	$scope.addDay = function(newDay,cb){
		//$http({method: 'POST', url: '/packageitem/create',params:newDay}).success(function (day){
		$http.post('/packageitem/create',newDay,{}).success(function(day){
			if(day.type=='day')
            	$scope.items.day.push(day);
            else
            	$scope.items.hotel.push(day);
            //$scope.aply();
            newDay = {};
            cb();
        });
	}
	$scope.updateDays = function(){
		$scope.daysnumber = [];
		for(var i = 1; i< 20; i++){
			$scope.daysnumber.push(i+'');
		}
		//console.log($scope.daysnumber);
		var items = $scope.items.day;
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