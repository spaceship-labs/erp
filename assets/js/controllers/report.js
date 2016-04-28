app.controller('reportCTL',function($scope,$http,$window,$upload,$rootScope,$cookies){
    $scope.content = content;
    $scope.filters = {};
    $scope.theReport = false;
    $scope.filtersArray = [
        { label : $rootScope.translates.arrival_date , value : 'arrival' , type : 'date' , field : 'arrival_date' , options : { to : new Date() } }
        ,{ label : $rootScope.translates.departure_date , value : 'departure' , type : 'date' , field : 'departure_date' , options : { to : new Date() } }
        ,{ label : $rootScope.translates.reservation_date , value : 'reserve' , type : 'date' , field : 'createdAt' , options : { to : new Date() } }
        ,{ label : $rootScope.translates.client , value : 'client' , type : 'autocomplete' , field : 'client' , model_ : 'client_' , action : 
            function(term){
                return $http.get('/client/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data; });
            } 
        }
        ,{ label : $rootScope.translates.hotel , value : 'hotel' , type : 'autocomplete' , field : 'hotel' , model_ : 'hotel' , action : 
            function(term){
                return $http.get('/hotel/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data.results; });
            }
        }
        ,{ label : "Tour" , value : 'tour' , type : 'autocomplete' , field : 'tour' , model_ : 'tour' , action : 
            function(term){
                return $http.get('/tour/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data.results; });
            }
        }
        ,{ label : "Proveedores de tours" , value : 'tourprovider' , type : 'autocomplete' , field : 'tour' , model_ : 'tour', special_field : 'provider' , action : 
            function(term){
                return $http.get('/tourprovider/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data.results; });
            }
        }
        ,{ label : $rootScope.translates.airport , value : 'airport' , type : 'autocomplete' , field : 'airport', model_ : 'airport' , action : 
            function(term){
                return $http.get('/airport/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data.results; });
            }
        }
        ,{ label : $rootScope.translates.transfer , value : 'transfer' , type : 'autocomplete' , field : 'transfer', model_ : 'transfer' , action : 
            function(term){
                return $http.get('/transfer/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data.results; });
            }
        }
        ,{ label : $rootScope.translates.agency , value : 'company' , type : 'autocomplete' , field : 'company' , model_ : 'company' , action : 
            function(term){
                return $http.get('/company/find', { params: { 'name': term , 'limit': 10 , 'sort' : 'name asc' }
                }).then(function(response){ return response.data.results; });
            }
        }
        ,{ label : $rootScope.translates.transfer_type , value : 'type' , type : 'select' , field : 'type' , options : [{ value : $rootScope.translates.d_all , key : 'all' },{value:$rootScope.translates.one_way,key:'one_way'},{value:$rootScope.translates.round_trip,key:'round_trip'}] }
        ,{ label : $rootScope.translates.payment_state , value : 'payment_state' , type : 'select' , field : 'state' , options : [{ value : $rootScope.translates.d_all , key : 'all' },{value:$rootScope.translates.pending,key:'pending'},{value:$rootScope.translates.liquidated,key:'liquidated'},{value:$rootScope.translates.canceled,key:'canceled'}] }
        ,{ label : $rootScope.translates.order_reserv_type , value : 'reservation_type' , type : 'select' , field : 'reservation_type' , options : [{ value : $rootScope.translates.hotel , key : 'hotel' },{ value : $rootScope.translates.tour , key:'tour' },{ value : $rootScope.translates.transfer , key:'transfer' } ]}
    ];
    $scope.setIC = function(val){ $scope.isCollapsedFilter = val; }
    $scope.removeFilter = function(f){
        delete $scope.filters[f.field];
        $scope.isCollapsedFilter = false;
        $scope.currentPage = 1;
        $cookies.putObject('filters',$scope.filters,{path:'/'});
        console.log('COOKIES',$cookies.getObject('filters'));
        sendFilterFx(0);
    };
    $scope.openFilter = function(f){
        for( x in $scope.filtersArray )
            $scope.filtersArray[x].open = false;
        f.open = true;
        $scope.isCollapsedFilter = true;
    };
    $scope.sendFilter = function(f){
        $scope.isCollapsedFilter = false;
        $scope.filters[f.field] = f;
        $scope.currentPage = 1;
        sendFilterFx(0);
        $cookies.putObject('filters',$scope.filters,{path:'/'});
        console.log('COOKIES',$cookies.getObject('filters'));
    };
    $scope.resetFilter = function(){
        $scope.isCollapsedFilter = false;
        $scope.filters = {};
        $scope.currentPage = 1;
        sendFilterFx(0);
    };
    var sendFilterFx = function(skip){
        var fx = {};
        var f = $scope.filters;
        for( var x in f ){
            if( f[x].special_field && f[x].special_field == 'provider' ){
                var t = f[x].model.item.tours;
                f[x].model.item = [];
                for(var y in t) f[x].model.item.push( t[y].id );
            }
            console.log(f[x]);
        }
        var params = { fields : f , skip : skip };
        console.log(f);
        $scope.SelectReport( $scope.theReport?$scope.theReport.type:'tours_gral' )
    };
    $scope.SelectReport = function(type){
        $scope.theReport = false;
        var params = { type : type , fields : $scope.filters };
        console.log('report params');
        console.log(params);
        //$window.location = '/order/reportcustom';
        $http.post('/order/reportcustom_',params,{}).success(function(result){
            console.log('report');
            console.log(result);
            $scope.theReport = result;
            $scope.theReport.type = type;
            $scope.theReport.template = "/template/find/" + type + ".html";
            jQuery('#reportsModal').modal('show');
            
        });
    };
    $scope.formatDate = function(date){
        var d = new Date(date);
        if(date) return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        else return false;
    };
    $scope.formatTime = function(time){
        var t = new Date(time);
        if(time) return t.getHours() + ':' + t.getMinutes();
        else return false;
    };
    $scope.getTotalOrder = function(order){
        var total = 0;
        if (order && order.reservations) {
            total = order.reservations.reduce(function(sum,reservation){
                return sum + reservation.fee;
            },0);
        }
        return total;
    };
    $scope.exportToMKP = function(){
        var href = '/exportdata/to_mkp?';
        href += 'from=' + (exportMKP.from?exportMKP.from:new Date());
        href += '&to=' + (exportMKP.to?exportMKP.to:new Date());
        $window.location = href;
    };
    //$scope.SelectReport( 'tours_gral' );
});