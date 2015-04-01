app.controller('lostandfoundCTL',function($scope,$http,$rootScope,$window){
    $scope.lostandfounds = lostandfounds || [];
    $scope.content = content;
    $scope.user = user;
    $scope.theorder = false;
    //$scope.lostandfound = {};
    //$scope.lostandfound.order = '550a38321604914e3859ff86';
    $scope.rtypes = getRtypes();
    $scope.searchOrder = {};
    $scope.hiddenFields = [
        { key : 'user',value : $scope.user.id }
    ];
    $scope.getOrder = function(){
        $http({method: 'POST', url: '/order/getorderfor',params:{id:$scope.lostandfound.order}}).success(function (result){
            $scope.theorder = result;
            console.log(result);
        });
    };
    $scope.savelaf = function(newlaf){
        if( $scope.lostandfound.order && $scope.theorder ){
            newlaf.order = $scope.lostandfound.order;
            $http({method: 'POST', url: '/lostandfound/create',params:newlaf}).success(function (result){
                $scope.lostandfound = result;
                console.log(result);
                $window.location =  "/lostandfound/";
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
        $scope.lostandfound.order = o.id;
        $scope.theorders = null;
    }
    //$scope.getOrder();
});
app.controller('lostandfoundEditCTL',function($scope,$http,$rootScope,$window){
    $scope.lostandfound = lostandfound || {};
    $scope.content = content;
    $scope.user = user;
    $scope.theorder = false;
    $scope.getOrder = function(){
        $http({method:'POST',url:'/order/getorderfor',params:{id:$scope.lostandfound.order}}).success(function (result){
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
function getRtypes(){
    return [
        { id : 'hotel' , name : 'Hotel' }
        ,{ id : 'tour' , name : 'Tour' }
        ,{ id : 'transfer' , name : 'Traslado' }
    ];
}