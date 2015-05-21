app.controller('tourcategoryCTL',function($scope,$http){
    $scope.tourcategories = tourcategories;
    $scope.content = content;
    $scope.createCategory = function(newcat){
        $http({method: 'POST', url: '/tourcategory/create',params:newcat}).success(function (cat){
            $scope.tourcategories.push(cat);
            jQuery('#myModal').modal('hide');
        });
    };
});
app.controller('tourcategoryEditCTL',function($scope,$http){
	$scope.tourcategory = tourcategory;
	$scope.content = content;
});