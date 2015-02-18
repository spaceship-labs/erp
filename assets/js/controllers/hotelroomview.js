app.controller('hroomviewCTL',function($scope,$http){
	$scope.hviews = hviews;
	$scope.content = content;
	$scope.createView = function(newView){
        $http({method: 'POST', url: '/hotelroomview/create',params:newView}).success(function (hview){
            $scope.hviews.push(hview);
            jQuery('#myModal').modal('hide');
        });
    };
});
app.controller('hroomviewEditCTL',function($scope,$http){
	$scope.hview = hview;
	$scope.content = content;
});
app.controller('hschemeviewCTL',function($scope,$http){
	$scope.schemes = schemes;
	$scope.content = content;
	$scope.createScheme = function(newscheme){
        $http({method: 'POST', url: '/foodscheme/create',params:newscheme}).success(function (hscheme){
            $scope.schemes.push(hscheme);
            jQuery('#myModal').modal('hide');
        });
    };
});