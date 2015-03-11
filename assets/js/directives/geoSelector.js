(function () {
    var controller = function($scope,$http,$rootScope){
        $scope.translates = $rootScope.translates;
        $scope.saveClass = 'fa-save';
        $scope.reverseClass = 'fa-search';
        $scope.markers = {};
        $scope.center = {};
        $scope.events = {
            map: {
                enable: ['click'],
                logic: 'emit'
            }
        };

        $scope.save = function(){
            $scope.saveClass = 'fa-upload';
            var saveMethod = $scope.saveFunction();
            console.log(saveMethod);
            if(saveMethod){
                $scope.saveFunction()($scope.markers.manual,function(){
                    $scope.saveClass = 'fa-check';
                });
            }else{
                $scope.saveClass = 'fa-save';
            }
        }
        $scope.reverseGeocode = function(){
            $scope.reverseClass = '';
            if($scope.markers.manual){
                var location = {
                    lat : $scope.markers.manual.lat,
                    lng : $scope.markers.manual.lng,
                };

                $http({
                    method: 'POST', 
                    url: '/home/reverseGeocode',
                    data: {
                        location : location
                    }
                }).success(function(results){
                    if(results.length){
                        var res = results[0];
                        $scope.address = res.streetName || '';
                        $scope.address += res.streetNumber ? ' '+res.streetNumber : '';
                        console.log($scope.address);
                    }
                    $scope.reverseClass = 'fa-search';
                });
            }else{
                $scope.reverseClass = 'fa-search';
            }
        }
        $scope.$on('leafletDirectiveMap.click', function(event,args){
            var leafEvent = args.leafletEvent;
            $scope.markers.manual = {
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
            };
        });

        $scope.initializeMap = function(){
            if($scope.location.latitude && $scope.location.longitude){
                $scope.markers.manual = {
                    lat : $scope.location.latitude,
                    lng : $scope.location.longitude,
                }
                $scope.center = $scope.markers.manual;
                $scope.center.zoom = 15;
            };

            $http({
                method: 'POST', 
                url: '/home/geocode',
                data: {
                    location : $scope.location
                }
            }).success(function(results){
                if(results.length){
                    var res = results[0];
                    $scope.markers.geocoded = {
                        lat : res.latitude,
                        lng : res.longitude,
                    }
                    if(!$scope.markers.manual){
                        $scope.center = $scope.markers.geocoded;
                        $scope.center.zoom = 15;
                    }
                }
            });
        }

        $scope.initializeMap();
       
    };

    controller.$inject = ['$scope','$http','$rootScope'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                location : '=',
                address : '=',
                saveFunction : '&',
            },
            templateUrl : '/template/find/geoSelector.html'
        };
    };
    app.directive('geoSelector', directive);

}());
