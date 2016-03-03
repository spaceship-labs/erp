(function () {
    var controller = function($scope,$http,$rootScope){
        $scope.saveClass = 'fa-save';
        $scope.reverseClass = 'fa-search';
        $scope.translates = $rootScope.translates;
        $scope.layers = {
            baselayers: {
                googleRoadmap: {
                    name: 'Google Streets',
                    layerType: 'ROADMAP',
                    type: 'google'
                }
            }
        };
        $scope.optionalMarker = [];
        if ($scope.optionalMarkers && $scope.optionalMarkers.length > 0) {
            var newMarker = {
                lat: $scope.center.lat,
                lng: $scope.center.lng,
                message: 'Nuevo item',
                name: 'Nuevo item',
                focus: true,
                draggable: $scope.dragEnabled
            };
            $scope.optionalMarkers.push(newMarker);
        }

        /*Creará un marcador con los campos que se le pasen en la directiva*/
        $scope.createMarker = function(){
            var newIndex = 'item_' + _.keys($scope.markers).length;
            $scope.markers[newIndex] = {
                lat : $scope.center.lat ,
                lng : $scope.center.lng ,
                message : 'Nuevo item' ,
                name: 'Nuevo',
                focus : true ,
                draggable : $scope.dragEnabled
            };
            //$scope.optionalMarker[newIndex] = angular.copy($scope.markers[newIndex]);
        };
        $scope.selectOptionalMarker = function(key,optional){
            if (optional && optional.lat) {
                $scope.markers[key] = {
                    lat : optional.lat,
                    lng : optional.lng,
                    message : optional.name,
                    name : optional.name,
                    focus : true,
                    draggable : !optional.type,
                    type : optional.type ? optional.type : 'marine',
                    identifier : optional.identifier
                };
            }
        };
        $scope.save = function(){
            $scope.saveClass = 'fa-upload';
            var saveMethod = $scope.saveFunction();
            //console.log(saveMethod);
            if(saveMethod){
                $scope.saveFunction()($scope.markers,function(){
                    $scope.saveClass = 'fa-check';
                });
            }else{
                $scope.saveClass = 'fa-save';
            }
        };
        $scope.initializeMap = function(){
            //iniciamos las medidas
            $scope.sizes = $scope.sizes || {};
            $scope.sizes.width = $scope.sizes.width || '100%';
            $scope.sizes.height = $scope.sizes.height || '300px';
            if( typeof $scope.center === 'undefined' ){
                $scope.center = {};
                $scope.center.lat = 21.1667;
                $scope.center.lng = -86.8333;
                $scope.center.zoom = 5;
            };
            formatMarkers();
        };
        $scope.removeMarker = function(key){
            //$scope.markers.splice(index,1);
            delete $scope.markers[key];
        };

        var formatMarkers = function(){
            if($scope.markers && _.keys($scope.markers).length > 0){
                for( var x in $scope.markers ){
                    //$scope.markers[x].draggable = $scope.dragEnabled;
                    $scope.markers[x].focus = false;
                }
            }else{
                $scope.markers = {};
            }
        };
        $scope.initializeMap();
       
    };

    controller.$inject = ['$scope','$http','$rootScope'];
    /*
        saveFunction : función a la que se mandarán los marcadores
        center : obj con lat y long 
        markers : arreglo de marcadores
            { lat , lng , message , focus , draggable }
        geocodeUrl : url del servicio al que se le pedirá lat y long
        reverseGeocodeUrl : url del servicio al que se le pedirá dirección
        dragEnabled : boolean true: editables en el drag, false:sólo visible
        multiple : por si queremos limitar a un sólo marker
        sizes : objeto con width y height 
    */
    var directive = function () {
        return {
            controller : controller,
            scope : {
                saveFunction : '&' ,
                center : '=' ,
                markers : '=' ,
                sizes : '=' ,
                geocodeUrl : '@' , //'/home/geocode'
                reverseGeocodeUrl : '@' , //'/home/reverseGeocode'
                dragEnabled : '=' ,
                multiple : '@',
                customFields : '=',
                optionalMarkers : '='
            },
            templateUrl : '/template/find/geoMarker.html'
        };
    };
    app.directive('geoMarker', directive);
}());
