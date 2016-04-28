app.controller('transporttypeCTL',function($scope,$http,$rootScope){
    $scope.transports = window.transports && transports.map(function(t){ t.name = t.car_id; return t; }) || [];
    $scope.transporttypes = window.transporttypes || [];
    $scope.transfers = window.transfers || [];
    $scope.content = content;
	$scope.getInfo = function(t){
        var r = {};
        r.pax = t.pax;
        r[$rootScope.translates.c_created] = t.createdAt;
		return r;
	};

    $scope.save = function(type){
        $http.post('/transporttype/create', type).then(function(res){
            if(res && res.data && res.data.id)
                window.location = '/transporttype/edit/'+res.data.id;
        }); 
    };
});

app.controller('transporttypeeditCTL',function($scope,$http,$rootScope){
    $scope.content = content;
    $scope.transfers = window.transfers || [];
    $scope.save = function(type){
        console.log(type);
        $http.post('/transporttype/update/'+type.id, type).then(function(res){
            console.log(res);
            console.lg('yipo');
            load(res.data, window.transports || []);
        });
    }

    function load(type, transports){
        $scope.transporttype = type;
        $scope.transporttype.transports = type.transports ? type.transports.map(normalizeTransportsName) : [];
        $scope.transports = transports.map(normalizeTransportsName)
    }

    load(window.transporttype || {}, window.transports || []);
});

function normalizeTransportsName(transport){
    transport.name = transport.car_id;
    return transport;
}
