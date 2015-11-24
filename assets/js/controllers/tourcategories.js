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
    $scope.categoryTypes = [
        {id : 'normal' , name : 'Categoría normal'}
        ,{ id : 'rate' , name : 'Rating'}
    ];
});
app.controller('tourcategoryEditCTL',function($scope,$http){
	$scope.tourcategory = tourcategory;
    for( x in $scope.tourcategory.rating ) $scope.tourcategory.rating[x] = typeof $scope.tourcategory.rating[x]=='string'?JSON.parse($scope.tourcategory.rating[x]):$scope.tourcategory.rating[x];
	$scope.content = content;
    $scope.categoryTypes = [
        {id : 'normal' , name : 'Categoría normal'}
        ,{ id : 'rate' , name : 'Rating'}
    ];
    $scope.classifications = [
        { id: 'aquatic' , name : "Acuático" }
        ,{ id: 'land' , name : "Terrestre" }
    ];
    $scope.addRemoveRate = function(type,index){
        if( type == 'add' ){
            $scope.tourcategory.rating = $scope.tourcategory.rating || [];
            var v = $scope.tourcategory.rating.length+1;
            $scope.tourcategory.rating.push({ value : v ,label:'Item ' + v });
        }else{
            $scope.tourcategory.rating.splice(index,1);
            for(x in $scope.tourcategory.rating)
                $scope.tourcategory.rating[x].value = parseInt(x)+1;
        }
    };
    $scope.save = function(){
        $scope.saveClass = 'fa-upload';
        var form = { rating : $scope.tourcategory.rating };
        $http({method: 'POST',url:'/tourcategory/update/'+$scope.tourcategory.id,params:form}).success(function(tourcategory){
            $scope.tourcategory.rating = tourcategory.rating;
            for( x in $scope.tourcategory.rating ) $scope.tourcategory.rating[x] = typeof $scope.tourcategory.rating[x]=='string'?JSON.parse($scope.tourcategory.rating[x]):$scope.tourcategory.rating[x];
            $scope.saveClass = 'fa-save';
        });
    };
    $scope.$on('SAVE_ALL', function () {
        $scope.save();
    });
});