app.controller('dpCTL',function($scope,$http){
    $scope.departurepoints = departurepoints.map(function(e){
            e.hotel = e.hotel?e.hotel.name:'';
            e.zone = e.zone?e.zone.name:'';
            return e;
        });
    $scope.content = content;
});
app.controller('dpNewCTL',function($scope,$http,$window){
    $scope.types = [
        { key:'hotel', name:'Hotel' }
        ,{ key:'zone', name:'Zona' }
    ];
    $scope.points = window.points;
    $scope.center = {
        lat : 21.1667,
        lng : -86.8333,
        zoom : 10
    };
    $scope.layers = { baselayers: { googleRoadmap: { name: 'Google Streets', layerType: 'ROADMAP', type: 'google' } } };
    $scope.newdp = {
        name : 'New point'
        ,description : 'New point'
        ,type : 'hotel'
        ,hotel : $scope.points[0].hotels[0].id
        ,zone : $scope.points[0].hotels[0].zone
    };
    $scope.markers = {};
    $scope.addMarker = function(){
        $scope.markers.m1 = {
        lat : 21.1667,
        lng : -86.8333,
        name : $scope.newdp.name,
        focus : true,
        draggable : true,
        };
    };
    $scope.$on('leafletDirectiveMap.click', function(event,args){
        var leafEvent = args.leafletEvent;
        $scope.markers.m1 = {
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
        };
    });
    $scope.addMarker();
    $scope.saveDP = function(){
        var ndp = {
            name : $scope.newdp.name
            ,description : $scope.newdp.description
            ,type : $scope.newdp.type
            ,location : $scope.newdp.location.id
            ,lat : $scope.markers.m1.lat
            ,lng : $scope.markers.m1.lng
        };
        if( ndp.type == 'hotel' ){
            ndp.hotel = $scope.newdp.hotel.id;
            ndp.zone = $scope.newdp.hotel.zone;
        }else if( ndp.type == 'zone' ){
            ndp.zone = $scope.newdp.zone.id;
        }
        //console.log('NEW DP',ndp);
        $http({method: 'POST', url: '/departurepoint/create',params:ndp}).success(function (result){
            if(result.err) alert(err);
            else if(result.dp) $window.location.href = '/departurepoint/edit/' + result.dp.id;
        });
    };
});
app.controller('dpEditCTL',function($scope,$http,$window){
    $scope.types = [
        { key:'hotel', name:'Hotel' }
        ,{ key:'zone', name:'Zona' }
    ];
    $scope.points = window.points;
    $scope.layers = { baselayers: { googleRoadmap: { name: 'Google Streets', layerType: 'ROADMAP', type: 'google' } } };
    $scope.newdp = window.dp;console.log('DP',window.dp);
    if( window.dp.lat && window.dp.lng )
        $scope.center = { lat : window.dp.lat , lng : window.dp.lng , zoom : 10 };
    else
        $scope.center = { lat : 21.1667, lng : -86.8333, zoom : 10 };
    $scope.markers = {m1:{
        lat : window.dp.lat || 21.1667,
        lng : window.dp.lng || -86.8333,
        name : $scope.newdp.name,
        focus : true,
        draggable : true,
    }};
    $scope.$on('leafletDirectiveMap.click', function(event,args){
        var leafEvent = args.leafletEvent;
        $scope.markers.m1 = {
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
        };
    });
    $scope.saveDP = function(){
        var ndp = {
            name : $scope.newdp.name
            ,description : $scope.newdp.description
            ,type : $scope.newdp.type
            ,location : $scope.newdp.location.id
            ,lat : $scope.markers.m1.lat
            ,lng : $scope.markers.m1.lng
        };
        if( ndp.type == 'hotel' ){
            ndp.hotel = $scope.newdp.hotel.id;
            ndp.zone = $scope.newdp.hotel.zone;
        }else if( ndp.type == 'zone' ){
            ndp.zone = $scope.newdp.zone.id;
        }
        console.log('ndp',ndp);
        $http({method: 'POST', url: '/departurepoint/update/'+$scope.newdp.id,params:ndp}).success(function (result){
            console.log(result);
            //if(result.err) alert(err); 
        });
    };
    $scope.getItems = function(id,type){
        var v = [];
        angular.forEach($scope.points,function(value,key){
            if( value.id == id ){
                if( type=='hotels' )
                    v = value.hotels;
                else if( type=='zones' )
                    v = value.zones;
            }
        });
        return v;
    }
});