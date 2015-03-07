app.controller('orderCTL',function($scope,$http){
    $scope.orders = orders;
    $scope.content = content;
    $scope.formatDate = function(date){
        var d = new Date(date);
        if(date) return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        else return false;
    };
    $scope.formatTime = function(time){
        var t = new Date(time);
        if(time) return t.getHours() + ':' + t.getMinutes();
        else return false;
    }
    $scope.formaOrders = function(){
        for(var x in $scope.orders){
            var transfer = false;
            for( var j in $scope.orders[x].reservations ){
                var r = $scope.orders[x].reservations[j];
                if( r.reservation_type == 'transfer' ){
                    transfer = r;
                }
            }
            $scope.orders[x].transfer = transfer;
        }
    };
    //$scope.formaOrders();
});
app.controller('orderNewCTL',function($scope,$http,$window){
    $scope.clients_ = clients_;
    $scope.hotels = hotels;
    $scope.allTours = allTours;
    $scope.transfers = transfers; // transfers disponibles
    $scope.client_ = '';
    $scope.airports = [];
    $scope.content = content;
    $scope.order = false;
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ { handle : 'creditcard' , name : 'Tarjeta de crédito' }, { handle : 'paypal' , name : 'Paypal' }];
    //Variables de control del front
    $scope.open = [false,false]; //abre/cierra los datepickers
    $scope.dtfa = [true,true]; //habilita / inhabilita las cajas de fecha 0:arrival 1:departure
    //variable de validación
    $scope.validateForms = [false,false,false];
    //Variable que guarla los datos de la Reserva de Transportación
    $scope.transfer = {}
    $scope.reservations = { tours : [] , hotels : [] };
    $scope.pax = [];
    for(var j=1;j<30;j++) $scope.pax.push(j);
    //funciones de control
    //Crea un cliente en caso de que sea uno nuevo
    $scope.createClient = function(newClient){
        //$http({method: 'POST', url: '/order/createClient',params:newClient}).success(function (client_){
        $http.post('/order/createClient',newClient,{}).success(function(client_) {
            if(clients_){
                $scope.clients_ = $scope.clients_.concat(client_);
                $scope.transfer.client = client_;
            }
            jQuery('#myModal').modal('hide');
        });
    };
    //abre/cierra datepickers
    $scope.open = function($event,var_open) {
        $event.preventDefault();$event.stopPropagation();$scope.open[var_open] = true;
    };
    //Va a crear la reserva del transfer
    $scope.saveAll = function(){
        //crear una orden
        var params = {};
        $http.post('/order/createOrder',params,{}).success(function(order) {
            console.log('order');
            console.log(order);
            if(order){
                $scope.order = order;
                //ver si existe transfer
                if( ! angular.equals( {} , $scope.transfer ) ){
                    $scope.reservationTransfer();
                }else{
                    //redirect, debería ser ver si existe otro tipo de reserva y guardar
                    //$location.path( "/order/edit/" + order.id );
                    $window.location =  "/order/edit/" + $scope.order.id;
                }
            }else{
                console.log('ERROR');
            }
        });
    }
    $scope.reservationTransfer = function(){
        var params = $scope.transfer;
        if( $scope.order ){
            params.order = $scope.order.id;
            params.reservation_type = 'transfer';
            params.transfer = $scope.transfer.transfer.transfer.id
            $http.post('/order/createReservation',params,{}).success(function(result) {
                //debería intentar guardar otro tipo de reserva pero por ahora redirecciona
                $window.location =  "/order/edit/" + $scope.order.id;
                //console.log('transfer result');console.log(result);
            });
        }
    };
    //obtiene los aeropuertos dependiendo de la ciudad elegida
    $scope.getAirports = function(){
        var params = {'id':$scope.transfer.hotel.location.id};
        $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){
            $scope.airports = result;
            $scope.transfer.airport = $scope.airports[0];
            $scope.getTransfers();
            $scope.updatePriceTransfer();
        });
    }
    //Controla los inputs de fechas roundtrip/oneway
    $scope.updateDatesFormat = function(){
        var h = $scope.transfer.origin == 'hotel'?true:false;
        var r = $scope.transfer.type == 'round_trip'?true:false;
        $scope.dtfa[0] = ( h && r ) || (!h);
        $scope.dtfa[1] = ( !h && r ) || h;
    }
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePriceTransfer = function(){
        var transfer = $scope.transfer;
        //console.log('update price');
        if( transfer.hotel && transfer.airport && transfer.type ){
            var mult = transfer.pax?( Math.ceil( transfer.pax / transfer.transfer.transfer.max_pax ) ):1;
            //console.log( 'mult: ' + mult + ' price: ' + transfer.transfer[transfer.type] );
            $scope.transfer.fee = transfer.transfer[transfer.type] * mult;
        }else{
            $scope.transfer.fee = 0;
        }
    };
    //obtiene los servicios que están disponibles dependiendo de las zonas que se elijan 
    $scope.getTransfers = function(){
        if( $scope.transfer.hotel.zone && $scope.transfer.airport.zone ){
            var params = { zone1 : $scope.transfer.hotel.zone , zone2 : $scope.transfer.airport.zone };
            console.log(params);
            $http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
                console.log('prices');
                console.log(result);
                $scope.transfers = result;
            });
        }
    };
    $scope.addTour = function(){
        if( $scope.addedTour )
            $scope.reservations.tours = $scope.reservations.tours.concat({tour:$scope.addedTour});
    };
    $scope.removeTour = function(index){
        if( $scope.reservations.tours[index] )
            $scope.reservations.tours.splice(index,1);
    }
});
app.controller('orderEditCTL',function($scope,$http,$window){
    $scope.content = content;
    $scope.order = order;
    $scope.user = user;
    $scope.hotels = hotels;
    $scope.clients_ = clients_;
    $scope.transfers = transfers;
    $scope.airports = false;
    $scope.transfer = false;
    $scope.dtfa = [true,true]; //habilita / inhabilita las cajas de fecha 0:arrival 1:departure
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ { handle : 'creditcard' , name : 'Tarjeta de crédito' }, { handle : 'paypal' , name : 'Paypal' }];
    var flagUpdate = false;
    $scope.formatReservations = function(){
        for(x in $scope.order.reservations){
            var reserve = $scope.order.reservations[x];
            if( reserve.reservation_type == 'transfer' )
                $scope.transfer = reserve;
        }
    };
    //abre/cierra datepickers
    $scope.open = function($event,var_open) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.open[var_open] = true
    };
    //Controla los inputs de fechas roundtrip/oneway
    $scope.updateDatesFormat = function(){
        var h = $scope.transfer.origin == 'hotel'?true:false;
        var r = $scope.transfer.type == 'round_trip'?true:false;
        $scope.dtfa[0] = ( h && r ) || (!h);
        $scope.dtfa[1] = ( !h && r ) || h;
        $scope.updatePrice();
    }
    $scope.getAirports = function(){
        var params = {'id':$scope.transfer.hotel.location};
        $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){
            $scope.airports = result;
        });
    }
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePrice = function(){
        //$scope.transfer.fee = Math.floor((Math.random()*6)+1);
    }
    $scope.printClient = function(){
        //console.log($scope.transfer.client);
    };
    $scope.saveAll = function(){
        $scope.reservationTransfer();
        if( $scope.transfer ){}
    };
    $scope.getTransfers = function(){
        if( $scope.transfer.hotel.zone && $scope.transfer.airport.zone ){
            var params = { zone1 : $scope.transfer.hotel.zone , zone2 : $scope.transfer.airport.zone };
            $http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
                $scope.transfers = result;
                for(var j=0;j<result.length;j++){ if( result[j].transfer.id == $scope.transfer.transfer ) $scope.transfer.transfer = result[j]; }
            });
        }
    };
    $scope.reservationTransfer = function(){
        var params = $scope.transfer;
        if( $scope.order ){
            params.order = $scope.order.id;
            params.reservation_type = 'transfer';
            params.transfer.transfer = $scope.transfer.transfer.transfer.id;
            $http.get('/reservation/update',params,{}).success(function(result) {
                console.log('Update');
                console.log(result);
            });
        }
    };
    $scope.formatReservations();
    $scope.getAirports();
    $scope.getTransfers();
    $scope.updateDatesFormat();
    //$scope.printClient();
});