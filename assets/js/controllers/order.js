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
app.controller('orderNewCTL',function($scope,$http,$window,$rootScope){
    $scope.alertM = { show: false, client : false, allEmpty: false };
    $scope.clients_ = clients_;
    $scope.hotels = hotels;
    $scope.allTours = allTours;
    $scope.transfers = transfers; // transfers disponibles
    $scope.client = {};
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
                $scope.client = client_;
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
        if( ! angular.equals( {} , $scope.client ) ){
            if( ! angular.equals( {} , $scope.transfer ) || ! angular.equals( {} , $scope.reservations.tours ) || ! angular.equals( {} , $scope.reservations.hotels ) ){
                var params = { client : $scope.client , reservation_method : 'intern' };
                $http.post('/order/createOrder',params,{}).success(function(order) {
                    //console.log('order');console.log(order);
                    if(order){
                        $scope.order = order;
                        //ver si existe transfer
                        if( ! angular.equals( {} , $scope.transfer ) ){
                            reservationTransfer();
                        }else if( $scope.reservations.tours.length>0 ){
                            //crea los tours existentes
                            reservationTours();
                        }else if( $scope.reservations.hotels.length>0 ){
                            //Crea los hoteles existentes
                            reservationHotels();
                        }
                    }else{
                        console.log('ERROR');
                    }
                });
            }else{
                $scope.alertM.show = true;
                $scope.alertM.allEmpty = true;
            }
        }else{
            $scope.alertM.show = true;
            $scope.alertM.client = true;
        }
    }
    var reservationTours = function(){
        var params = { items : $scope.reservations.tours , order : $scope.order };
        $http.post('/order/createReservationTour',params,{}).success(function(result) {
            if( $scope.reservations.hotels.length>0 )
                reservationHotels();
            else
                $window.location =  "/order/edit/" + $scope.order.id;
        });
    }
    var reservationHotels = function(){
        var params = { items : $scope.reservations.hotels , order : $scope.order };
        $http.post('/order/createReservationTour',params,{}).success(function(result) {
            $window.location =  "/order/edit/" + $scope.order.id;
        });
    }
    var reservationTransfer = function(){
        var params = $scope.transfer;
        if( $scope.order ){
            params.order = $scope.order.id;
            params.reservation_type = 'transfer';
            params.client = $scope.client;
            params.transfer = $scope.transfer.transfer.transfer.id;
            $http.post('/order/createReservation',params,{}).success(function(result) {
                //Guardando los tours en caso de existir
                if( $scope.reservations.tours.length>0 )
                    reservationTours();
                else if( $scope.reservations.hotels.length>0 )
                    reservationHotels();
                else
                    $window.location =  "/order/edit/" + $scope.order.id;
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
    //Obtener el número máximo de personas para un cuarto
    var getPaxHotel = function(item,pax){
        var i, res = [] , max = 10;
        if( pax ) max = pax;
        max = max * item.roomsNumber;
        for (i = 1; i <= max ; i++) res.push(i);
        item.hotel.maxApax = res; item.hotel.maxCpax = res;
    };
    //obtener el precio del hotel dependiendo de la las fechas, por la temporada
    $scope.getPriceHotel = function(item){
        if( item.roomType ){
            $http.get('/room/'+item.roomType).success(function(room){
                getPaxHotel(item,room.pax);
                if( item.hotel.seasonScheme && item.roomType && room.seasonal == 'true' ){
                  var params = {
                    seasonScheme : item.hotel.seasonScheme, room : item.roomType ,
                    startDate : item.startDate.toISOString(), endDate : item.endDate.toISOString()
                  };
                  $http.post('/hotel/getprice',params,{}).success(function(price) {
                    item.fee = item.roomsNumber*((price && price != '0')?price:room.fee);
                    item.fee = parseFloat(item.fee.replace('"',''));
                  });
                }else{
                  item.fee = item.roomsNumber*(room.fee?parseFloat(room.fee.replace('"','')):0);
                }
            });
        }
    };
    //Cambia el precio del tour dependiendo del pax
    $scope.updateTourPrice = function(item){
        item.fee = item.tour.fee&&item.adultNumber?item.tour.fee*item.adultNumber:0;
        item.fee += item.tour.feeChild&&item.childrenNumber?item.tour.feeChild*item.childrenNumber:0;
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
        $scope.updateDatesFormat();
    };
    //obtiene los servicios que están disponibles dependiendo de las zonas que se elijan 
    $scope.getTransfers = function(){
        if( $scope.transfer.hotel.zone && $scope.transfer.airport.zone ){
            var params = { zone1 : $scope.transfer.hotel.zone , zone2 : $scope.transfer.airport.zone };
            console.log(params);
            $http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
                console.log('prices');console.log(result);
                $scope.transfers = result;
                console.log('transfers available');
                console.log(result);
            });
        }
    };
    $scope.addTH = function(type){
        if( type=='tour' && $scope.addedTour ){
            $scope.reservations.tours = $scope.reservations.tours.concat({tour:$scope.addedTour, reservation_type : 'tour'});
        }else if( type=='hotel' && $scope.addedHotel ){
            $scope.reservations.hotels = $scope.reservations.hotels.concat({hotel:$scope.addedHotel, reservation_type : 'hotel'});
        }
    };
    $scope.removeTH = function(index,type){
        if( type=='tour' && $scope.reservations.tours[index] )
            $scope.reservations.tours.splice(index,1);
        if( type=='hotel' && $scope.reservations.hotels[index] )
            $scope.reservations.hotels.splice(index,1);
    };
    $scope.validateDates = function(){
        $scope.customMessages = {
            Tta : { show : false , type : 'alert', message : $rootScope.translates.c_ordermessg1 },
            Ttd : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg2 },
            TH  : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg3 }
        };
        if( ! angular.equals( {} , $scope.transfer ) ){
            validateTt();
            validateTH();
        }
        validatetH();
    }
    var validateTt = function(){
        if( $scope.reservations.tours.length > 0 ){
            var r1 = '', r2 = '';
            var transfer = $scope.transfer;
            var date_TA = new Date(transfer.arrival_date);
            var date_TD = new Date(transfer.departure_date);
            for( x in $scope.reservations.tours ){
                var date_t = new Date($scope.reservations.tours[x].startDate);
                if( $scope.dtfa[0] ){
                    if( date_t < date_TA ) r1 += (r1!=''?', ':'') + $scope.reservations.tours[x].tour.name;
                }
                if( $scope.dtfa[1] ){
                    if( date_t > date_TD ) r2 += (r2!=''?', ':'') + $scope.reservations.tours[x].tour.name;
                }
            }
            if( r1 ){
                $scope.customMessages.Tta.xmessage = r1;
                $scope.customMessages.Tta.show = true;
            }
            if( r2 ){
                $scope.customMessages.Ttd.xmessage = r2;
                $scope.customMessages.Ttd.show = true;
            }
        }
    }
    var validateTH = function(){
        if( $scope.reservations.hotels.length > 0 ){
            var r1 = '';
            var transfer = $scope.transfer;
            var date_TA = new Date(transfer.arrival_date);
            var date_TD = new Date(transfer.departure_date);
            for( x in $scope.reservations.hotels ){
                var date_ta = new Date($scope.reservations.hotels[x].startDate);
                var date_td = new Date($scope.reservations.hotels[x].endDate);
                var added = false;
                if( $scope.dtfa[0] ){
                    if( date_ta != date_TA ){ 
                        r1 += (r1!=''?', ':'') + $scope.reservations.hotels[x].hotel.name;
                        added = true;
                    }
                }
                if( $scope.dtfa[1] && !added ){
                    if( date_td != date_TD ) r1 += (r1!=''?', ':'') + $scope.reservations.hotels[x].hotel.name;
                }
            }
            if( r1 ){
                $scope.customMessages.TH.xmessage = r1;
                $scope.customMessages.TH.show = true;
            }
        }
    }
    var validatetH = function(){};
    $scope.USClient = true;
    $scope.saveContact = function(){
        console.log('contact entra');
        if($scope.client && $scope.contact.name && $scope.contact.email && $scope.contact.phone ){
            $scope.contact.client = $scope.client.id;
            //$http({method: 'POST', url: '/client/add_contact2',params:$scope.contact}).success(function (result){
            $http.post('/client/add_contact2',$scope.contact,{}).success(function(result) {
                $scope.contact.id = result.id;
                console.log(result);
            });
        }
    };
});
app.controller('orderEditCTL',function($scope,$http,$window){
    $scope.content = content;
    $scope.order = order;
    $scope.theclient = theclient;
    $scope.user = user;
    $scope.hotels = hotels;
    $scope.clients_ = clients_;
    $scope.transfers = transfers;
    $scope.airports = false;
    $scope.transfer = false;
    $scope.dtfa = [true,true]; //habilita / inhabilita las cajas de fecha 0:arrival 1:departure
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ { handle : 'creditcard' , name : 'Tarjeta de crédito' }, { handle : 'paypal' , name : 'Paypal' }];
    $scope.reservations = { tours : [] , hotels : [] };
    var flagUpdate = false;
    $scope.formatReservations = function(){
        for(var x in $scope.order.reservations){
            var reserve = $scope.order.reservations[x];
            if( reserve.reservation_type == 'transfer' )
                $scope.transfer = reserve;
            else if( reserve.reservation_type == 'tour' )
                $scope.reservations.tours.push(reserve);
            else if( reserve.reservation_type == 'hotel' )
                $scope.reservations.hotels.push(reserve);
        }
        for(var x in $scope.reservations.hotels){
            $http({method: 'GET', url: '/hotel/'+$scope.reservations.hotels[x].hotel.id}).success(function (result){
                console.log('get hotel result');
                console.log(result);
                console.log($scope.reservations.hotels[x]);
                $scope.reservations.hotels[x].hotel.rooms = result.rooms;
            });
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
    }
    $scope.getAirports = function(){
        var params = {'id':$scope.transfer.hotel.location};
        $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){
            $scope.airports = result;
        });
    }
    $scope.updateTourPrice = function(item){
        item.fee = item.tour.fee&&item.adultNumber?item.tour.fee*item.adultNumber:0;
        item.fee += item.tour.feeChild&&item.childrenNumber?item.tour.feeChild*item.childrenNumber:0;
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
        $scope.updateDatesFormat();
    };
    $scope.printClient = function(){
        //console.log($scope.transfer.client);
    };
    $scope.saveAll = function(){
        if( ! angular.equals( {} , $scope.transfer ) )
            reservationTransfer();
        if( $scope.reservations.tours.length>0 )
            reservationTours();
        if( $scope.reservations.hotels.length>0 )
            reservationHotels();
    };
    $scope.getTransfers = function(){
        if( $scope.transfer.hotel.zone && $scope.transfer.airport.zone ){
            var params = { zone1 : $scope.transfer.hotel.zone , zone2 : $scope.transfer.airport.zone };
            $http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
                $scope.transfers = result;
                for(var j=0;j<result.length;j++){ if( result[j].transfer.id == $scope.transfer.transfer ) $scope.transfer.transfer = result[j]; }
                    console.log(transfers);
            });
        }
    };
    /*$scope.reservationTransfer = function(){
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
    };*/
    var reservationTransfer = function(){
        var params = {item : $scope.transfer};
        if( $scope.order ){
            params.item.transfer = $scope.transfer.transfer.transfer.id;
            $http.post('/reservation/update/',params).success(function(result) {
                console.log('Update transfer');
                console.log(result);
            });
        }
    };
    var reservationTours = function(){
        var params = { items : $scope.reservations.tours };
        $http.post('/order/updateReservation',params,{}).success(function(result) {
            console.log('Update tours');
            console.log(result);
        });
    }
    var reservationHotels = function(){
        var params = { items : $scope.reservations.hotels };
        $http.post('/order/updateReservation',params,{}).success(function(result) {
            console.log('Update hotels');
            console.log(result);
        });
    };
    //Obtener el número máximo de personas para un cuarto
    var getPaxHotel = function(item,pax){
        var i, res = [] , max = 10;
        if( pax ) max = pax;
        max = max * item.roomsNumber;
        for (i = 1; i <= max ; i++) res.push(i);
        item.hotel.maxApax = res; item.hotel.maxCpax = res;
    };
    //obtener el precio del hotel dependiendo de la las fechas, por la temporada
    $scope.getPriceHotel = function(item){
        if( item.roomType ){
            $http.get('/room/'+item.roomType).success(function(room){
                getPaxHotel(item,room.pax);
                if( item.hotel.seasonScheme && item.roomType && room.seasonal == 'true' ){
                  var params = {
                    seasonScheme : item.hotel.seasonScheme, room : item.roomType ,
                    startDate : item.startDate.toISOString(), endDate : item.endDate.toISOString()
                  };
                  $http.post('/hotel/getprice',params,{}).success(function(price) {
                    item.fee = item.roomsNumber*((price && price != '0')?price:room.fee);
                    item.fee = parseFloat(item.fee.replace('"',''));
                  });
                }else{
                  item.fee = item.roomsNumber*(room.fee?parseFloat(room.fee.replace('"','')):0);
                }
            });
        }
    };
    $scope.formatReservations();
    $scope.getAirports();
    $scope.getTransfers();
    $scope.updateDatesFormat();
    //$scope.printClient();
});