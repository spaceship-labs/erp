app.controller('tourcategoryCTL',function($scope,$http){
    $scope.tourcategories = tourcategories;
    $scope.content = content;
    $scope.createCategory = function(newcat){
        $http({method: 'POST', url: '/tourcategory/create',params:newcat}).success(function (cat){
            $scope.tourcategories.push(cat);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.classifications = [
        { id: 'aquatic' , name : "Acuático" }
        ,{ id: 'land' , name : "Terrestre" }
    ];
});
app.controller('tourcategoryEditCTL',function($scope,$http){
	$scope.tourcategory = tourcategory;
	$scope.content = content;
    $scope.categoryTypes = {
        id : 'normal' , label : 'Categoría normal'
        , id : 'rate' , label : 'Rating'
    }
    $scope.classifications = [
        { id: 'aquatic' , name : "Acuático" }
        ,{ id: 'land' , name : "Terrestre" }
    ];
});