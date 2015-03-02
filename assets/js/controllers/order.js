app.controller('orderCTL',function($scope,$http){
    $scope.orders = orders;
    $scope.content = content;
    $scope.formatDate = function(date){
        var d = new Date(date);
        if(date)
            return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        else
            return false;
    };
    $scope.formatTime = function(time){
        var t = new Date(time);
        if(time)
            return t.getHours() + ':' + t.getMinutes();
        else
            return false;
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
    $scope.formaOrders();
});
app.controller('orderNewCTL',function($scope,$http,$window){
    $scope.clients_ = clients_;
    $scope.hotels = hotels;
    $scope.transfers = transfers;
    $scope.client_ = '';
    $scope.airports = [];
    $scope.content = content;
    $scope.order = false;
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ { handle : 'creditcard' , name : 'Tarjeta de crédito' }, { handle : 'paypal' , name : 'Paypal' }];
    //Variables de control del front
    $scope.open = [false,false]; //abre/cierra los datepickers
    $scope.isCtransfer = false; // Colapsable para generar reserva de traslado
    $scope.dtfa = [true,true]; //habilita / inhabilita las cajas de fecha 0:arrival 1:departure
    //variable de validación
    $scope.validateForms = [false,false,false];
    //Variable que guarla los datos de la Reserva de Transportación
    $scope.transfer = {}
    //funciones de control
    //Crea un cliente en caso de que sea uno nuevo
    $scope.createClient = function(newClient){
        //$http({method: 'POST', url: '/order/createClient',params:newClient}).success(function (client_){
        $http.post('/order/createClient',newClient,{}).success(function(client_) {
            if(clients_){
                $scope.clients_.push(client_);
                $scope.client_ = client_;
            }
            jQuery('#myModal').modal('hide');
        });
    };
    //abre/cierra datepickers
    $scope.open = function($event,var_open) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.open[var_open] = true
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
            $http.post('/order/createReservation',params,{}).success(function(result) {
                //debería intentar guardar otro tipo de reserva pero por ahora redirecciona
                if( result ){
                    //$location.path( "/order/edit/" + $scope.order.id );
                }else{
                    console.log('ERROR TRANSFER');
                }
                $window.location =  "/order/edit/" + $scope.order.id;
                console.log('transfer result');
                console.log(result);
            });
        }
    }
    //obtiene los aeropuertos dependiendo de la ciudad elegida
    $scope.getAirports = function(){
        var params = {'id':$scope.transfer.hotel.location.id};
        $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){
            $scope.airports = result;
            $scope.updatePrice();
            $scope.transfer.airport = $scope.airports[0];
        });
    }
    //Controla los inputs de fechas roundtrip/oneway
    $scope.updateDatesFormat = function(){
        var h = $scope.transfer.origin == 'hotel'?true:false;
        var r = $scope.transfer.type == 'round_trip'?true:false;
        $scope.dtfa[0] = ( h && r ) || (!h);
        $scope.dtfa[1] = ( !h && r ) || h;
        $scope.updatePrice();
    }
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePrice = function(){
        $scope.transfer.fee = Math.floor((Math.random()*6)+1);
    }
});
app.controller('orderEditCTL',function($scope,$http,$window){
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
    $scope.getTransfers = function(){
        for(x in $scope.order.reservations){
            var reserve = $scope.order.reservations[x];
            //console.log('reserve');
            if( reserve.reservation_type == 'transfer' ) //$scope.transfers_.push(reserve);
                $scope.transfer = reserve;
            //console.log(reserve);
        }
    }
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
            $scope.updatePrice();
            $scope.transfer.airport = $scope.airports[0];
        });
    }
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePrice = function(){
        $scope.transfer.fee = Math.floor((Math.random()*6)+1);
    }
    $scope.printClient = function(){
        console.log($scope.transfer.client);
    }
    $scope.getTransfers();
    $scope.getAirports();
    $scope.updateDatesFormat();
    $scope.printClient();
});