app.controller('transportCTL',function($scope,$http,$rootScope){
    $scope.transports = transports;
    $scope.types = types;
    $scope.content = content;
    $scope.serviceTypes = getTypes();
    $scope.companies = window.show_companies;


    $scope.createTransport = function(newTransport){
        $http({method: 'POST', url: '/transport/create',params:newTransport}).success(function (transport){
            $scope.transports.push(transport);
            jQuery('.reset').click();
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(transport){
        var r = {};
        r.ID = transport.car_id;
        r[$rootScope.translates.c_created] = transport.createdAt;
        return r;
    };

    $scope.validate = function(transport){
        $http({method: 'GET', url: '/transport/find?limit=1&car_id='+transport.car_id }).success(function (exist){
            if(exist && exist.length){
                angular.element('input[name=car_id]').addClass('has-error');
            }else{
                $scope.createTransport(transport);
            }
        });
    };

    $scope.remove_invalid = function(){
        angular.element('input[name=car_id]').removeClass('has-error');
    };
});
app.controller('transportEditCTL',function($scope,$upload,$http,$window){
    $scope.transport = transport;
    $scope.content = content;
    $scope.types = types;
    $scope.companies = show_companies;
    $scope.serviceTypes = getTypes();
    $scope.remove_invalid = function(){
        angular.element('input[name=car_id]').removeClass('has-error');
    };
});

app.controller('transportPriceCTL',function($scope, $http, $filter){
    $scope.locations = window.locations || [];
    $scope.prices = window.prices || [];
    $scope.zones = window.zones || [];
    $scope.serviceTypes = getTypes();
    $scope.location = {};
    $scope.filter_zones = {};
    $scope.modal = {};

    $scope.changeLocation = function(type){
        $scope.filter_zones[type] = $filter('filter')($scope.zones, function(val){
                                return val.location == $scope.location[type];
                            }); 
    };

    $scope.setName = function(){
        if($scope.modal.zoneFrom && $scope.modal.zoneTo){
            var pre = _.find($scope.zones, function(z){
                        return z.id == $scope.modal.zoneFrom;
                    }),
                pos = _.find($scope.zones, function(z){
                        return z.id == $scope.modal.zoneTo;
                });
            $scope.modal.name = (pre && pre.name || '') + ' | ' + (pos && pos.name || '')
        }
    };

    $scope.save = function(){
        if(!$scope.modal.id){
            $http.post('/transportprice/create', $scope.modal).then(function(res){
                if(res && res.data){
                    jQuery('.reset').click();
                    var zoneFrom = _.find($scope.zones, function(z){
                            return z.id == res.data.zoneFrom;
                        });

                    var zoneTo = _.find($scope.zones, function(z){
                            return z.id == res.data.zoneTo;
                        });
                    if(zoneFrom){
                        res.data.zoneFrom = zoneFrom;
                    }
                    if(zoneTo){
                        res.data.zoneTo = zoneTo
                    }
                    $scope.prices.push(res.data);
                    jQuery('#transportprice').modal('hide'); 
                    $scope.modal = {};
                }
            });
        }else{
            $http.post('/transportprice/'+$scope.modal.id, $scope.modal).then(function(res){
                if(res && res.data){
                    delete $scope.modal.id;
                    jQuery('.reset').click();
                    jQuery('#transportprice').modal('hide'); 
                    $scope.modal = {};
                }                
            });
        }
    };
    
    
    $scope.getTypeName = function(type){
        var f = _.find($scope.serviceTypes, function(t){
                return t.id == type;
        });
        return f && f.name || '';
    };

    $scope.edit = function(price){
        $scope.location.from = price.zoneFrom.location;
        $scope.location.to = price.zoneTo.location;
        $scope.changeLocation('from');
        $scope.changeLocation('to');

        $scope.modal = {
            zoneFrom: price.zoneFrom.id,
            zoneTo: price.zoneTo.id,
            service_type: price.service_type,
            price: price.price,
            name: price.name,
            id: price.id
        };
        jQuery('#transportprice').modal('show');
    };
});

var getTypes = function(){
    r = [
        { name : 'Colectivo' , id : 'C' }
        ,{ name : 'Privado' , id : 'P' }
        ,{ name : 'Lujo' , id : 'L' }
    ];
    return r;
};
