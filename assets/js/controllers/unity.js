app.controller('unitytypeCTL',function($scope,$http){
	$scope.unities = unities;
	$scope.content = content;
	$scope.createUnityType = function(newUnityType){
        $http({method: 'POST', url: '/unitytype/create',params:newUnityType}).success(function (uType){
            $scope.unities.push(uType);
            jQuery('#myModal').modal('hide');
        });
    };
});
app.controller('unitytypeEditCTL',function($scope,$http){
	$scope.unity = unity;
	$scope.content = content;
});
app.controller('unityCTL',function($scope,$http,$rootScope){
    $scope.unities = unities;
    $scope.unityTypes = unityTypes;
    $scope.content = content;
    $scope.getInfo = function(unity){
        unity.createdAt=(moment(unity.createdAt).format('LL'));
        unity.updatedAt=(moment(unity.updatedAt).format('LL'));
        var r = {};
        r[$rootScope.translates.c_name] = unity.name;
        r['Clave'] = unity.mkpid;
        r[$rootScope.translates.c_created] = unity.createdAt;
        r[$rootScope.translates.c_updated] = unity.updatedAt;
        return r;
    };
    $scope.createUnity = function(newunity){
        $http({method: 'POST', url: '/unity/create',params:newunity}).success(function (result){
            $scope.unities = result.unities;
            jQuery('#myModal').modal('hide');
        });
    };
});
app.controller('unityEditCTL',function($scope,$http){
    $scope.unity = unity;
    $scope.content = content;
    $scope.unityTypes = unityTypes;
});