app.controller('claimCTL',function($scope,$http,$rootScope,$window){
    $scope.claims = claims || [];
    $scope.content = content;
    $scope.user = user;
    $scope.theorder = false;
    //$scope.lostandfound = {};
    //$scope.lostandfound.order = '550a38321604914e3859ff86';
    $scope.rtypes = getRtypes();
    $scope.hiddenFields = [
        { key : 'user',value : $scope.user.id }
    ];
    $scope.claimtypes = getclaimTypes();
    $scope.getOrder = function(){
        $http({method: 'POST', url: '/order/getorderfor',params:{id:$scope.claim.order}}).success(function (result){
            $scope.theorder = result;
            console.log(result);
        });
    };
    $scope.saveclaim = function(newclaim){
        if( $scope.claim.order && $scope.theorder ){
            newclaim.order = $scope.claim.order;
            $http({method: 'POST', url: '/claim/create',params:newclaim}).success(function (result){
                $scope.claim = result;
                console.log(result);
                $window.location =  "/claim/edit/"+result.id;
            });
        }
    };
    $scope.formatDate = function(date){
        return formatDate(date);
    };
    $scope.searchOrderfx = function(){
        var params = $scope.searchOrder;
        $http({method:'POST',url:'/order/customsearch',params:params}).success(function (result){
            $scope.theorders = result;
        });
    };
    $scope.selectOrder = function(o){
        $scope.theorder = o;
        $scope.claim.order = o.id;
        $scope.theorders = null;
    }
});
app.controller('claimEditCTL',function($scope,$http,$rootScope,$window){
    $scope.claim = claim || {};
    $scope.content = content;
    $scope.user = user;
    $scope.theorder = false;
    $scope.claimtypes = getclaimTypes();
    $scope.getOrder = function(){
        $http({method:'POST',url:'/order/getorderfor',params:{id:$scope.claim.order}}).success(function (result){
            $scope.theorder = result;
        });
    };
    $scope.getOrder();
    $scope.formatDate = function(date){
        return formatDate(date);
    };
});
var formatDate = function(date){
    if(date)
        return moment(date).format('LL');
    else
        return false;
}
var getclaimTypes = function(){
    return [
        { id : '0' , name : 'Unidad tarde' }
        ,{ id : '1' , name : 'Operador' }
    ];
};
function getRtypes(){
    return [
        { id : 'hotel' , name : 'Hotel' }
        ,{ id : 'tour' , name : 'Tour' }
        ,{ id : 'transfer' , name : 'Traslado' }
    ];
}