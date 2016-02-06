app.controller('orderCTL',function($scope,$http,$window,$upload,$rootScope){
    $scope.orders = [];
    $scope.cancelationMotives = cancelationMotives;
    $scope.content = content;
    $scope.totalOrders = 0;
    $scope.currentPage = 1;
    $scope.filters = {};
    $scope.theView = 'table';
    $scope.theReport = false;
    $scope.filtersArray = [
        { label : 'Folio' , value : 'folio' , type : 'number' , field : 'folio' }
        ,{ label : $rootScope.translates.arrival_date , value : 'arrival' , type : 'date' , field : 'arrival_date' , options : { to : new Date() } }
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
        $http.post('/order/customFind',params,{}).success(function(result) {
            if(result){
                $scope.orders = result.orders;
                $scope.formaOrders();
                $scope.totalOrders = result.count;
            }
        });
    };
    $scope.SelectReport = function(type){
        $scope.theReport = false;
        var params = { type : type , fields : $scope.filters };
        console.log('report params');
        console.log(params);
        $http.post('/order/reportcustom',params,{}).success(function(result){
            console.log('report');
            console.log(result);
            $scope.theReport = result;
            $scope.theReport.type = type;
            $scope.theReport.template = "/template/find/" + type + ".html";
            jQuery('#reportsModal').modal('show');
        });
    }
    sendFilterFx(0);
    $scope.formatDate = function(date){
        var d = moment(date).utc();
	if (date) return d.format("DD/MM/YYYY");
        //if(date) return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
        else return false;
    };
    $scope.formatTime = function(time){
        var t = moment(time).utc();
        if(time) return t.format("hh:mm");
        else return false;
    };
    $scope.formaOrders = function(){
        for(var x in $scope.orders){
            var transfer = false;
            $scope.orders[x].tours = [];
            $scope.orders[x].hotels = [];
            for( var j in $scope.orders[x].reservations ){
                var r = $scope.orders[x].reservations[j];
                if( r.reservation_type == 'transfer' ){
                    transfer = r;
                }else if( r.reservation_type == 'tour' ){
                    $scope.orders[x].tours.push(r);
                }else if( r.reservation_type == 'hotel' ){
                    $scope.orders[x].hotels.push(r);
                }
            }
            $scope.orders[x].transfer = transfer;
        }
        //console.log(orders);
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

    var w = angular.element($window);
    w.bind('resize', function () {
        if( w.width() > 650 ){
            for(var x in $scope.isHiden){
                $scope.isHiden[x] = false;
            }
        }
    });
    $scope.pageChanged = function() {
        var skip = ($scope.currentPage-1) * 20;
        sendFilterFx(skip);
    };
    $scope.saveFile = function() {
        $scope.loading = true;
        $scope.f = { finish : false };
        $scope.upload = $upload.upload({ url: '/order/uploadcvs' , file: $scope.file
        }).progress(function(evt){ $scope.loadingProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config) {
            $scope.loading = false;
            $scope.loadingProgress = 0;
            $scope.f.finish = true;
            $scope.f.success = data.success;
            $scope.f.results = data.result;
            $scope.f.errors = data.errors;
        });
    };
    $scope.WFile = function($files,$e){
        if($files) {
            $scope.fileName = $files[0].name;
            $scope.file = $files;
        }
    };
    $scope.orderDetails = function(order){
        $scope.theorder = order;
        jQuery('#orderModal').modal('show');
    };
    $scope.openCancelOrder = function(order){
        $scope.theorder = order;
        jQuery('#cancelModal').modal('show');
    };
    $scope.cancelOrder = function(){
        var params = { id : $scope.theorder.id, cancelation : $scope.cancelation };
        $http.post('/order/cancelorder',params,{}).success(function(results){
            console.log(results);
            jQuery('#cancelModal').modal('hide');
            $scope.currentPage = 1;
            sendFilterFx(0);
        });
    }
    $scope.getRoom = function(item){
        console.log(item);
        for( var x in item.hotel.rooms ){
            if( item.roomType == item.hotel.rooms[x].id )
                return item.hotel.rooms[x].name_es;
        }
    };
    $scope.exportToMKP = function(){
        var href = '/exportdata/to_mkp?';
        href += 'from=' + (exportMKP.from?exportMKP.from:new Date());
        href += '&to=' + (exportMKP.to?exportMKP.to:new Date());
        //href += '&type=' + (exportMKP.type?exportMKP.type:'tour');
        $window.location = href;
    }
});
app.controller('orderNewCTL',function($scope,$http,$window,$rootScope,$document){
    //varibales para seleccionar los items a agregar o mostrar
    $scope.selectReservationType = '';
    $scope.collapse = false;
    //terminan varibales nuevas
    $scope.DatepickerOptions = {
        minDate : new Date()
    };
    $scope.DatepickerOptions.minDate.setDate( $scope.DatepickerOptions.minDate.getDate() + 1 );
    $scope.customMessages = {
        Tta : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg1 }
        ,Ttd : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg2 }
        ,TH  : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg3 }
        ,rcs : { 
            show : false , type : 'alert' , message : 'La reserva se ha creado con éxito.' 
            , buttons : [
                { label : 'Ver reserva' , action : function(){ redirectToEdit('edit'); } }
                ,{ label : 'Ver todas las reservas' , action : function(){ redirectToEdit('list'); } }
            ]
        }
        ,rcf : { show : false , type : 'alert' , message : 'Ha ocurrido un error al crear la reserva, favor de revisar los campos e intentar de nuevo.' }
    };
    var customTimer;
    $scope.PIwidth = jQuery('body').scrollTop() > 250?jQuery('.paymentInformation').parent().width() + 'px':'auto';
    $scope.fixedItem = jQuery('body').scrollTop() > 250?true:false;
    $scope.customCart = jQuery( window ).width() <= 992?true:false;
    jQuery( window ).scroll(function(){
        clearTimeout(customTimer);
        customTimer = setTimeout(function(){ 
            //console.log( jQuery('body').scrollTop() );
            if( jQuery('body').scrollTop() > 250 ){
                $scope.PIwidth = jQuery('.paymentInformation').parent().width() + 'px';
                $scope.fixedItem = true;
            }else{
                $scope.fixedItem = false;
                $scope.PIwidth = 'auto';
            }
            //console.log($scope.fixedItem + '  --  ' + $scope.PIwidth);
            $scope.$apply();
        }, 0);
    });
    jQuery( window ).resize(function(){
        clearTimeout(customTimer);
        customTimer = setTimeout(function(){ 
            $scope.customCartShow = jQuery( window ).width() > 992?true:false;
            $scope.customCart = jQuery( window ).width() <= 992?true:false;
            $scope.PIwidth = jQuery('body').scrollTop() > 250?jQuery('.paymentInformation').parent().width() + 'px':'auto';
            $scope.fixedItem = jQuery('body').scrollTop() > 250?true:false;
            $scope.$apply();
        }, 100);
    });
    $scope.steps = 1;
    $scope.setSteps = function(action,set){
        if( $scope.client && $scope.client.id ){
            if(set)
                $scope.steps = $scope.steps!=set?set:0;
            else
                $scope.steps += action=='next'?1:-1;
            $scope.steps = $scope.steps>5||$scope.steps<1?1:$scope.steps;
            if($scope.steps==4 && !$scope.transfer){
                updateReservationsGeneralFields('transfer');
                $scope.setHotelHere($scope.transfer);
                if($scope.transfer&&$scope.transfer.hotel&&!$scope.transfer.airport)
                    $scope.getAirports($scope.transfer);
            }
            if($scope.steps==3 && $scope.reservations.tours.length>0) updateReservationsGeneralFields('tour');
        }else{
            $scope.steps = 1;
            $scope.showMessage('ucf');
        }
    };
    var updateReservationsGeneralFields = function(type){
        if(type == 'transfer'){
            $scope.transfer = { 
                currency : $scope.generalFields.currency
                ,payment_method : $scope.generalFields.payment_method
                ,autorization_code : $scope.generalFields.autorization_code
                ,hotel : $scope.generalFields.hotel
                ,room : $scope.generalFields.hotelroom
                ,arrival_date : $scope.generalFields.arrival_date
                ,arrival_fly : $scope.generalFields.arrival_fly
                ,state : $scope.generalFields.state
            };
            if($scope.transfer.hotel)
                $scope.getAirports($scope.transfer);
        }else if(type=='tour'){
            for(var x in $scope.reservations.tours){
                $scope.reservations.tours[x].currency = $scope.generalFields.currency;
                $scope.reservations.tours[x].payment_method = $scope.generalFields.payment_method;
                $scope.reservations.tours[x].hotel = $scope.generalFields.hotel;
                $scope.reservations.tours[x].room = $scope.generalFields.hotelroom;
                $scope.reservations.tours[x].state = $scope.generalFields.state;
            }
        }
    };
    $scope.theTotal = 0;
    var updateTotal = function(){
        var total = 0;
        total += $scope.transfer.fee||0;
        for(var x in $scope.reservations.tours)
            total += $scope.reservations.tours[x].fee || 0;
        for(var x in $scope.reservations.hotels)
            total += $scope.reservations.hotels[x].fee || 0;
        $scope.theTotal = total;
    }
    $scope.getMinPrice = function(item,type){
        if( item.rooms ){
            var aux = 0;
            for( var x in item.rooms ){
                if( type == 'adult' )
                    aux = parseFloat(item.rooms[x].fee)<aux||aux==0?parseFloat(item.rooms[x].fee):aux;
                if( type == 'child' )
                    aux = parseFloat(item.rooms[x].feeChild)<aux||aux==0?parseFloat(item.rooms[x].feeChild):aux;
            }
            return aux;
        }else{
            return '0';
        }
    }
    $scope.company = company;
    $scope.companies = [];
    $scope.thecompany = $scope.company;
    $scope.alertM = { show: false, client : false, allEmpty: false };
    $scope.alertMessage = { show : false , title : '' , message : '' , type : 'alert' };
    //$scope.clients_ = clients_;
    $scope.hotels = [];
    //console.log($scope.hotels);
    $scope.allTours = {};
    $scope.allHotels = {};
    $scope.transfers = []; // transfers disponibles
    $scope.client = '';
    $scope.client_flag = false;
    $scope.airports = [];
    $scope.content = content;
    $scope.interactions = interactions;
    $scope.order = false;
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ 
        { handle : 'creditcard' , name : 'Tarjeta de crédito' }
        ,{ handle : 'paypal' , name : 'Paypal' }
        ,{ handle : 'cash' , name : 'Efectivo' }
        ,{ handle : 'prepaid' , name : 'Prepago' }
    ];
    $scope.service_types = [ {value:'C',label:'Colectivo'}, {value:'P',label:'Privado'}, {value:'D',label:'Directo'} ];
    //Variables de control del front
    $scope.open = [false,false]; //abre/cierra los datepickers
    $scope.dtfa = [true,true]; //habilita / inhabilita las cajas de fecha 0:arrival 1:departure
    //variable de validación
    $scope.validateForms = [false,false,false];
    //Variable que guarla los datos de la Reserva de Transportación
    $scope.transfer = false;
    $scope.reservations = { tours : [] , hotels : [] };
    $scope.generalFields = {};
    $scope.collapseList = { tour : false , hotel : false };
    $scope.pax = [];
    for(var j=1;j<( interactions.omitServiceOnReservation?13:30 );j++) $scope.pax.push(j);
    //funciones de control
    //lismpia todos los campos de la reserva
    $scope.resetForm = function(type){
        if(type){
            if(type=='client'){
                $scope.client = '';
                $scope.generalFields = false;
                $scope.client_flag = false;
            }else if(type=='transfer')
                $scope.transfer = false;
            else if(type=='tour')
                $scope.reservations.tours = [];
            else if(type=='hotel')
                $scope.reservations.hotels = [];
        }else{
            $scope.transfer = false;
            $scope.reservations = { tours : [] , hotels : [] };
            $scope.client = '';
            $scope.client_flag = false;
            $scope.generalFields = false;
        }
    };
    //Crea un cliente en caso de que sea uno nuevo
    $scope.createUpdateClient = function(){
        //$http({method: 'POST', url: '/order/createClient',params:newClient}).success(function (client_){
        var action = "/order/createClient";
        if(!$scope.client_flag){
            $scope.client.company = $scope.thecompany.id;
        }else{
            action = "/order/updateClient"
        }
        $http.post(action,$scope.client,{}).success(function(client_) {
            /*if(clients_){
                $scope.clients_ = $scope.clients_.concat(client_);
            }*/
            console.log(client_);
            if( !$scope.client_flag )
                $scope.client = client_;
            else if( client_.client[0] )
                $scope.client = client_.client[0];
            $scope.client_flag = true;
            //jQuery('#myModal').modal('hide');
        });

    };
    //abre/cierra datepickers
    $scope.open = function($event,var_open) {
        $event.preventDefault();$event.stopPropagation();
        $scope.open[var_open] = true;
    };
    //Va a crear la reserva del transfer
    $scope.saveAll = function(){
        //crear una orden
        if( typeof $scope.client != 'string' && ! angular.equals( {} , $scope.client ) ){
            if( ! angular.equals( {} , $scope.transfer ) || ! angular.equals( {} , $scope.reservations.tours ) || ! angular.equals( {} , $scope.reservations.hotels ) ){
                if( $scope.transfer != false && !angular.equals( {} , $scope.transfer ) ) {
                    var arrivalDate = new Date($scope.transfer.arrival_date);
                    var departureDate = new Date($scope.transfer.departure_date);
                    if (arrivalDate > departureDate) {
                        $scope.alertM.show = true;
                        $scope.alertM.date = true;
                        return;
                    }
                }
                var params = { 
                    client:$scope.client 
                    ,company : $scope.thecompany.id
                };
                $http.post('/order/createOrder',params,{}).success(function(order) {
                    //console.log('order');console.log(order);
                    if(order && order.id){
                        $scope.order = order;
                        //ver si existe transfer
                        if( $scope.transfer != false && ! angular.equals( {} , $scope.transfer ) && $scope.transfer.fee ){
                            $scope.reservationTransfer();
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
    };
    var reservationTours = function(){
        for(var y in $scope.reservations.tours)
            for(var x in $scope.reservations.tours[y].contacts)
                $scope.reservations.tours[y].contacts[x] = $scope.client.contacts[$scope.reservations.tours[y].contacts[x]];
        var params = { items : $scope.reservations.tours , order : $scope.order.id , generalFields : $scope.generalFields };
        params.currency = $scope.generalFields.currency;
        $http.post('/order/createReservationTour',params,{}).success(function(result) {
            if( $scope.reservations.hotels.length>0 )
                reservationHotels();
            else{
                $scope.showMessage('rcs');
                //$scope.redirectToEdit( );
            }
        });
    };
    var reservationHotels = function(){
        var params = { items : $scope.reservations.hotels , order : $scope.order.id , generalFields : $scope.generalFields };
        $http.post('/order/createReservationTour',params,{}).success(function(result) {
            $scope.showMessage('rcs');
            //$scope.redirectToEdit( );
        });
    };
    $scope.reservationTransfer = function(){
        var params = $scope.transfer;
        if( $scope.order ){
            params.order = $scope.order.id;
            params.reservation_type = 'transfer';
            params.client = $scope.client;
            params.transferprice = $scope.transfer.transfer; // <<--- importante: tal vez regresar a .id 
            params.transfer = $scope.transfer.transfer.transfer.id;
            params.payment_method = params.payment_method || $scope.generalFields.payment_method;
            params.currency = $scope.generalFields.currency;
            params.state = $scope.generalFields.state;
            params.autorization_code = params.autorization_code || $scope.generalFields.autorization_code;
            //console.log($scope.transfer);console.log(params);
            for(var x in $scope.transfer.contacts)
                $scope.transfer.contacts[x] = $scope.client.contacts[$scope.transfer.contacts[x]];
            $http.post('/order/createReservation',params,{}).success(function(result) {
                //Guardando los tours en caso de existir
                if( $scope.reservations.tours.length>0 )
                    reservationTours();
                else if( $scope.reservations.hotels.length>0 )
                    reservationHotels();
                else{
                    $scope.showMessage('rcs');
                    //$scope.redirectToEdit( );
                }
            });
        }
    };
    $scope.showMessage = function(action){
        $scope.alertMessage.buttons = [ { label : 'Ok' , action : function(){ $scope.alertMessage.show=false; } } ];
        $scope.alertMessage.title = 'Error en la orden';
        if( action == 'rcs' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'La reserva se ha creado con éxito.';
            $scope.alertMessage.buttons = [ 
                { label : 'Ver reserva' , action : function(){ redirectToEdit('edit'); } }
                ,{ label : 'Ver todas las reservas' , action : function(){ redirectToEdit('list'); } }
            ];
            $scope.alertMessage.classType = 'alert-successCustom';
            $scope.alertMessage.title = 'Mensaje de la reserva';
        }
        if( action == 'ucf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = "El usuario debe de ser creado o seleccionado antes de continuar al siguiente paso.";
        }
        if( action == 'trcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos incompletos, revisar el traslado antes de continuar.';
        }
        if( action == 'tcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos inválidos, revisar el Tour antes de continuar.';
        }
        if( action == 'hcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos inválidos, revisar el Hotel antes de continuar.';
        }
    }
    //$scope.showMessage('rcs');
    var redirectToEdit = function(action){
        if( action == 'edit' )
            $window.location =  "/order/edit/" + $scope.order.id;
        if( action == 'list' )
            $window.location =  "/order/";
    };
    //obtiene los aeropuertos dependiendo de la ciudad elegida
    $scope.getAirports = function(transfer){
        if(transfer) $scope.transfer = transfer;
        var params = {'id':$scope.transfer.hotel.location.id};
        $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){
            //console.log('airports');console.log(result);
            $scope.airports = result;
            $scope.transfer.airport = $scope.airports[0];
            $scope.getTransfers();
            $scope.updatePriceTransfer();
        });
    };
    //Controla los inputs de fechas roundtrip/oneway
    $scope.updateDatesFormat = function(){
        var h = $scope.transfer.origin == 'hotel'?true:false;
        var r = $scope.transfer.type == 'round_trip'?true:false;
        $scope.dtfa[0] = ( h && r ) || (!h);
        $scope.dtfa[1] = ( !h && r ) || h;
    }
    //Obtener el número máximo de personas para un cuarto
    $scope.getPaxHotel = function(item,pax){
        var i, res = [] , max = 10, resChildren = [];
        if( pax ) max = pax;
        max = max * item.roomsNumber;
        for (i = 1; i <= max ; i++) res.push(i);
        for (i = 0; i <= ( max - (item.pax||0) ) ; i++) resChildren.push(i);
        item.hotel.maxApax = res; 
        item.hotel.maxCpax = resChildren;
    };
    //obtener el precio del hotel dependiendo de la las fechas, por la temporada
    $scope.getPriceHotel = function(item){
        if( item.roomType ){
            $http.get('/room/'+item.roomType).success(function(room){
                $scope.getPaxHotel(item,room.pax);
                var daysNumber = 1;
                if( item.startDate && item.endDate ){
                    /*var start = moment(item.startDate);
                    var end = moment(item.endDate);
                    daysNumber = end.diff(start,'days');*/
                    daysNumber = $scope.getDiffDates(item.startDate,item.endDate);
                    //console.log(daysNumber);
                }
                if( item.hotel.seasonScheme && item.roomType && room.seasonal == 'true' ){
                  var params = {
                    seasonScheme : item.hotel.seasonScheme, room : item.roomType ,
                    startDate : item.startDate.toISOString(), endDate : item.endDate.toISOString()
                  };
                  $http.post('/hotel/getprice',params,{}).success(function(price) {
                    item.fee = item.roomsNumber*((price && price != '0')?price:room.fee);
                    item.fee = parseFloat(item.fee.replace('"',''));
                    item.fee *= daysNumber;
                    updateTotal();
                  });
                }else{
                  item.fee = item.roomsNumber*(room.fee?parseFloat(room.fee.replace('"','')):0);
                  item.fee *= daysNumber;
                  updateTotal();
                }
            });
        }
    };
    //Cambia el precio del tour dependiendo del pax
    $scope.updateTourPrice = function(item){
        item.fee = item.tour.fee&&item.pax?item.tour.fee*item.pax:0;
        item.fee += item.tour.feeChild&&item.kidPax?item.tour.feeChild*item.kidPax:0;
        if( item.currency && $scope.thecompany.base_currency.id != item.currency.id )
            item.fee *= $scope.thecompany.exchange_rates[item.currency.id].sales;
        updateTotal();
    }
    //set the transfer by pax number
    var setTransferDefault = function(){
        $scope.transfer.pax = $scope.transfer.pax || 1;
        $scope.transfer.type = $scope.transfer.type || 'one_way';
        $scope.transfer.serviceType = $scope.transfer.serviceType || 'P';
        console.log('transfers');
        console.log($scope.transfers);
        if( $scope.transfers.length > 0 ){
            var initMaxPax = 100;
            for( var x in $scope.transfers ){
                if( $scope.transfer.serviceType == 'P' && $scope.transfers[x].transfer.service_type == 'P' && $scope.transfer.pax <= $scope.transfers[x].transfer.max_pax && $scope.transfers[x].transfer.max_pax <= initMaxPax ){
                    initMaxPax = $scope.transfers[x].transfer.max_pax;
                    $scope.transfer.transfer = $scope.transfers[x];
                }
                if( $scope.transfer.serviceType == 'C' && $scope.transfers[x].transfer.service_type == 'C' )
                    $scope.transfer.transfer = $scope.transfers[x];
            }
            console.log('if transfers');
            console.log($scope.transfer);
        }
    }
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePriceTransfer = function(){
        console.log($scope.transfer)
        if(!$scope.transfer.currency)
            $scope.transfer.currency = $scope.thecompany.base_currency;
        if( interactions.omitServiceOnReservation )
            setTransferDefault();
        var transfer = $scope.transfer;
        if( transfer.hotel && transfer.airport && transfer.type && transfer.transfer ){
            var mult = transfer.pax?( Math.ceil( transfer.pax / transfer.transfer.transfer.max_pax ) ):1;
            //console.log( 'mult: ' + mult + ' price: ' + transfer.transfer[transfer.type] );
            $scope.transfer.fee = transfer.transfer[transfer.type] * mult;
            if( $scope.transfer.currency.id != $scope.thecompany.base_currency.id )
                $scope.transfer.fee *= $scope.thecompany.exchange_rates[$scope.transfer.currency.id].sales;
        }else{
            $scope.transfer.fee = 0;
        }
        $scope.updateDatesFormat();
        if( transfer.arrival_time )
            transfer.arrivalpickup_time = getpickuptime(transfer,'arrival');
        if( transfer.departure_time )
            transfer.departurepickup_time = getpickuptime(transfer,'departure');
        updateTotal();
    };
    $scope.getpickuptime = function(){
        var transfer = $scope.transfer;
        if( transfer.arrival_time )
            transfer.arrivalpickup_time = getpickuptime(transfer,'arrival');
        if( transfer.departure_time )
            transfer.departurepickup_time = getpickuptime(transfer,'departure');
    }
    //obtiene los servicios que están disponibles dependiendo de las zonas que se elijan 
    $scope.getTransfers = function(){
        //console.log('get transfers');console.log($scope.transfer);
        if( $scope.transfer.hotel.zone.id && $scope.transfer.airport.zone ){
            var params = { 
                zone1 : $scope.transfer.hotel.zone.id
                ,zone2 : $scope.transfer.airport.zone 
                ,company : $scope.thecompany
            };
            console.log('transfers params');
            console.log(params);
            //$http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
            $http.post('/order/getAvailableTransfers', params , {}).success(function (result){
                console.log('prices');console.log(result);
                $scope.transfers = result;
                //console.log('transfers available');console.log(result);
                if( interactions.omitServiceOnReservation )
                    $scope.updatePriceTransfer();
            });
        }
    };
    $scope.setHotelHere = function(item){
        if( $scope.reservations.hotels[0] ){
            item.hotel = $scope.reservations.hotels[0].hotel;
        }
    };
    //
    $scope.addTH = function(type,item){
        console.log($scope.client);
        $scope.collapse = true;
        $scope.selectReservationType = type;
        if( typeof $scope.client != 'string' && ! angular.equals( {} , $scope.client ) && item ){
            //console.log('addedTour');console.log($scope.addedTour);
            if( type=='tour' ){
                //console.log('tours');
                for(var x in item.schedules){
                    var aux = false;
                    if( typeof item.schedules[x] == 'string' ){
                        item.schedules[x] = JSON.parse(item.schedules[x]);
                        aux = new Date(item.schedules[x].from);
                        item.schedules[x].from = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                        aux = new Date(item.schedules[x].to);
                        item.schedules[x].to = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                    }else{
                        item.schedules[x] = item.schedules[x];
                    }
                }
                for(var x in item.departurePoints){
                    var aux = false;
                    if( typeof item.departurePoints[x] == 'string' ){
                        item.departurePoints[x] = JSON.parse(item.departurePoints[x]);
                        aux = new Date(item.departurePoints[x].time);
                        item.departurePoints[x].time = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                    }else{
                        item.departurePoints[x] = item.departurePoints[x];
                    }
                }
                //console.log(item);
                var auxTour = { tour : item, reservation_type : 'tour' , client : $scope.client };
                $scope.reservations.tours = $scope.reservations.tours.concat(auxTour);
                console.log($scope.reservations.tours);
                var lastIndex = $scope.reservations.tours.length-1;
                var someElement = 'itemTour'+lastIndex;
            }else if( type=='hotel'){
                $scope.reservations.hotels = $scope.reservations.hotels.concat({hotel:item, reservation_type : 'hotel' , client : $scope.client });
                var lastIndex = $scope.reservations.hotels.length-1;
                var someElement = 'itemHotel'+lastIndex;
            }
            $scope.collapseList[type] = true;
            updateReservationsGeneralFields(type);
            setTimeout(function(){ 
                someElement = angular.element(document.getElementById(someElement));
                $document.scrollToElement(someElement, 30, 1000);
                $scope.$apply();
            }, 100);
        }else{
            $scope.alertM.show = true;
            $scope.alertM.client = true;
        }
    };
    $scope.removeTH = function(index,type){
        $scope.selectReservationType = '';
        if( type=='tour' && $scope.reservations.tours[index] ){
            $scope.reservations.tours.splice(index,1);
            $scope.collapse = $scope.reservations.tours.length>0?true:false;
        }
        if( type=='hotel' && $scope.reservations.hotels[index] ){
            $scope.reservations.hotels.splice(index,1);
            $scope.collapse = $scope.reservations.hotels.length>0?true:false;
        }
    };
    $scope.validateDates = function(){
        if( $scope.transfer && ! angular.equals( {} , $scope.transfer ) ){
            validateTt();
            validateTH();
        }
        validatetH();
    };
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
    };
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
    var getCompanies = function(){
        $http.post('/company/find',{},{}).success(function(result) {
            //console.log('get companies');console.log(result);
            $scope.companies = result.results;
        });
        //$scope.companies
    };
    getCompanies();
    $scope.getHotels = function(val){ 
        return $http.get('/hotel/find', { params: { name: val } }).then(function(response){
            //console.log(response);
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.getClients = function(val){
        return $http.get('/client/find', { params: { name: val , company : $scope.thecompany.id } }).then(function(response){
            return response.data.map(function(item){ return item; });
        });
    };
    $scope.getAirlines = function(val){
        return $http.get('/airline/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    /*$scope.getTours = function(val){
        var url = $scope.thecompany.adminCompany?'/tour/find':'/tour/findProducts/';
        var params = { name : val , company : $scope.thecompany.id , adminCompany : $scope.thecompany.adminCompany||false };
        //console.log(url);
        return $http.get( url , { params: params } ).then(function(response){
            //console.log(response.data);
            return response.data.results.map(function(item){ return item; });
        });
    };*/
    $scope.getAllTours = function(searchTours){
        console.log($scope.thecompany);
        var skip = $scope.toursCurrentPage?($scope.toursCurrentPage-1) * 5 : 0;
        var url = $scope.thecompany.adminCompany?'/tour/find':'/tour/findProducts/';
        var params = { skip : skip, limit : 5 , company : $scope.thecompany.id , adminCompany : $scope.thecompany.adminCompany||false };
        if(searchTours!='') params.name = searchTours;
        //console.log(params);
        $http.post( url , params ).then(function(response){
            $scope.allTours = response.data;
            console.log(response.data);
        });
    };
    $scope.getAllTours('');
    $scope.getAllHotels = function(){
        var skip = $scope.hotelsCurrentPage?($scope.hotelsCurrentPage-1) * 5 : 0;
        var url = $scope.thecompany.adminCompany?'/hotel/find':'/hotel/findProducts/';
        //var params = { visible : true, skip : skip, limit : 5 , company : $scope.thecompany.id , adminCompany : $scope.thecompany.adminCompany||false };
        var params = { skip : skip, limit : 5 , company : $scope.thecompany.id , adminCompany : $scope.thecompany.adminCompany||false };
        if($scope.searchHotels!='') params.name = $scope.searchHotels;
        console.log(params);
        $http.get( url , { params: params } ).then(function(response){
            //console.log(response.data);
            $scope.allHotels = response.data;
            console.log($scope.allHotels);
        });
    };
    $scope.getAllHotels();
    /*Contacts section*/
    //$scope.USClient = true;
    $scope.saveContact = function(){
        if($scope.client && $scope.contact.name && $scope.contact.email && $scope.contact.phone ){
            $scope.contact.client = $scope.client.id;
            //$http({method: 'POST', url: '/client/add_contact2',params:$scope.contact}).success(function (result){
            $http.post('/client/add_contact2',$scope.contact,{}).success(function(result) {
                $scope.contact.contact = result.contacts;
                //console.log(result);
            });
        }
    };
    console.log($scope.client);
    //Set vars for tempContact
    $scope.setTheItemForContacts = function(item,type,index){
        $scope.theIFC = item?item:{};
        $scope.theIFC.contacts = item.contacts || [];
        $scope.theIFC.theType = type;
        $scope.theIFC.indexT = index;
        //console.log('IFC');console.log($scope.theIFC);
        var x = $scope.theIFC.pax-$scope.theIFC.contacts.length;
        $scope.theIFCArray = getRange(x);
        $scope.tempContacts = [];
    }
    $scope.contactFlag = 'create';
    $scope.theIFC = false;
    $scope.openContactForm = function(item,action){
        if(item) $scope.contact = item;
        else $scope.contact = false;
        $scope.contactFlag = action;
        $scope.modalCollapse = true;
    };
    $scope.cancelContactForm = function(){
        $scope.contact = false;
        $scope.modalCollapse = false;
    };
    //Guardar general del popup de clientes
    $scope.saveContactForm = function(){
        //primero guardar todos los contactos,
        var aux = [];
        for(var x in $scope.tempContacts){
            if( $scope.tempContacts[x].name && $scope.tempContacts[x].email && $scope.tempContacts[x].name != '' && $scope.tempContacts[x].email != '' ){
                $scope.tempContacts[x].client = $scope.client.id;
                aux.push($scope.tempContacts[x]);
            }
        }
        if( aux.length > 0 ){
            $http.post('/client/add_contact2',{contacts:aux},{}).success(function(result){
                //aquí vamos a manejar los contactos una vez que hayan sido agregados
                //result debe de ser el arreglo de contactos
                var newContacts = result.contact;
                $scope.client.contacts = result.contacts;
                newContacts = _.pluck(newContacts,'id');
                for(var x in result.contacts){
                    if( newContacts.indexOf( result.contacts[x].id ) >= 0 ){
                        //add this contact to list
                        $scope.addContactToItem( result.contacts[x].id );
                    }
                }
                //limpiar los campos de los contactos agregados
                var x = $scope.theIFC.pax - $scope.theIFC.contacts.length;
                $scope.theIFCArray = false;
                $scope.theIFCArray = getRange(x);
                //Agregar los contactos a su item correspondiente y cerrar el popup
                if( $scope.theIFC.theType=='transfer' ){
                    $scope.transfer = $scope.transfer || {};
                    $scope.transfer.contacts = $scope.theIFC.contacts;
                }else if( $scope.theIFC.theType=='tour' ){
                    $scope.reservations.tours[$scope.theIFC.indexT].contacts = $scope.theIFC.contacts;
                }
                $scope.contact = false;
                $scope.modalCollapse = false;
                $scope.theIFC = false;
                //console.log($scope.transfer);console.log($scope.reservations.tours);
            });
        }
    };
    //Devuelve un objeto cliente del arreglo de contactos del cliente
    $scope.getClientByID = function(id){
        for( var x in $scope.client.contacts )
            if( $scope.client.contacts[x].id == id )
                return $scope.client.contacts[x];
    }
    //Guardar un contacto individual 
    $scope.createUpdateContact2 = function(contact_item,type,index){
        if($scope.client && contact_item && contact_item.name ){
            var action = type=='create'?"/client/add_contact2":"/client/update_contact2";
            contact_item.client = $scope.client.id;
            console.log(contact_item);
            $http.post(action,contact_item,{}).success(function(result) {
                console.log(result);
                $scope.client.contacts = result.contacts;
                for(var x in $scope.client.contacts){
                    if( $scope.client.contacts[x].id == result.contact.id ){ 
                        console.log( 'index de contacto de cliente: ' + index );
                        $scope.theIFCArray.splice( index , 1 );
                        $scope.addContactToItem(x);
                    }
                }
            });
        }else{
            console.log('datos incompletos');
        }
    };
    $scope.addContactToItem = function(index){
        //$scope.theIFC.contacts
        if(!$scope.theIFC.contacts){
            $scope.theIFC.contacts = [];
            $scope.theIFC.contacts.push( index );
        }else{
            if( $scope.theIFC.contacts.indexOf(index) < 0 )
                $scope.theIFC.contacts.push(index);
        }
        var x = $scope.theIFC.pax - $scope.theIFC.contacts.length;
        $scope.theIFCArray = getRange(x);
    };
    $scope.removeContactFromItem = function(item){
        $scope.theIFC.contacts.splice( $scope.theIFC.contacts.indexOf(item) , 1 );
        var x = $scope.theIFC.pax - $scope.theIFC.contacts.length;
        $scope.theIFCArray = getRange(x);
    };
    $scope.validateItem = function(item,type,index){
        if(type=='tour')
            validateTour(item,index);
        if(type=='transfer')
            validateTransfer(item);
        if(type=='hotel')
            validateHotel(item,index);
    };
    var validateTransfer = function(item){
        if( item.fee ){
            if( typeof item.saved == 'undefined' ){
                jQuery('#myModal').modal('show');
                $scope.setTheItemForContacts(item,'transfer',false);
            }
            item.saved = true;
            $scope.setSteps('next',false);
        }else{
            item.saved = false;
            $scope.showMessage('trcf');
        }
    };
    var validateTour = function(item,index){
        if( item.startDate && ( item.pax || item.kidPax ) && item.fee && item.departureTime ){
            //if( typeof item.saved == 'undefined' ){
                jQuery('#myModal').modal('show');
                $scope.setTheItemForContacts(item,'tour',index);
            //}
            item.saved = true;
        }else{
            item.saved = false;
            $scope.showMessage('tcf');
        }
    };
    var validateHotel = function(item,index){
        if( item.startDate && item.pax && item.fee && item.endDate && item.roomType && item.roomsNumber ){
            //if( typeof item.saved == 'undefined' ){
                jQuery('#myModal').modal('show');
                $scope.setTheItemForContacts(item,'hotel',index);
            //}
            item.saved = true;
        }else{
            item.saved = false;
            $scope.showMessage('hcf');
        }
    };
    $scope.openTH = function(type,item){
        $scope.theIFC = item;
        $scope.theIFC.description = item.description_es?item.description_es.split("\n"):false;
        if( type=='hotel' ){
            $scope.theIFC.services = item.services_es?item.services_es.split("\n"):false;
            $scope.theIFC.payed_services = item.payed_services_es?item.payed_services_es.split("\n"):false;
            if( $scope.theIFC.rooms ){
                for( var x in $scope.theIFC.rooms ){
                    $scope.theIFC.rooms[x].description = $scope.theIFC.rooms[x].description_es?$scope.theIFC.rooms[x].description_es.split("\n"):false;
                }
            }
        }
        if( type == 'tour' ){
            $scope.theIFC.includes = item.includes_es?item.includes_es.split("\n"):false;
            $scope.theIFC.noincludes = item.does_not_include_es?item.does_not_include_es.split("\n"):false;
            $scope.theIFC.recommendations = item.recommendations_es?item.recommendations_es.split("\n"):false;
        }
        $scope.theIFC.type = type;
        $scope.theIFC.folder = type + 's';
        console.log($scope.theIFC);
    };
    var getRange = function(number){
        console.log('getrange: ' + number);
        var result = [];
        if( number && number>0 )
            for( x = 0; x < number; x++ )
                result.push(x);
        return result;
    };
    $scope.formatDate = function(date){
        return moment(date).format('L');
    };
    $scope.getDiffDates = function(start,end){
        var result = '';
        if(start && end){
            var start = moment(start);
            var end = moment(end);
            result = end.diff(start,'days');
        }
        return result;
    };
    $scope.showToAdd = function(type){
        $scope.selectReservationType = type;
        if( type == 'Transfer' ){
            $scope.transfer = { pax : 1 };
            var someElement = angular.element(document.getElementById('itemTransfer'));
        }else{ 
            var someElement = angular.element(document.getElementById('selector'+type+'s'));
            $scope.collapse = false;
        }
        setTimeout(function(){ 
            $document.scrollToElement(someElement, 30, 1000);
            $scope.$apply();
        }, 100);
    };
    $scope.$watch('x', function(newValue, oldValue) {
        $scope.collapse = false;
        $scope.selectReservationType = $scope.x;
    });
    $scope.getRange = function(number){
        var result = [];
        if( number && number>0 ) for( x = 0; x < number; x++ ) result.push(x);
        return result;
    };
});
app.controller('orderEditCTL',function($scope,$http,$window){
    var customTimer;
    $scope.PIwidth = jQuery('body').scrollTop() > 250?jQuery('.paymentInformation').parent().width() + 'px':'auto';
    $scope.fixedItem = jQuery('body').scrollTop() > 250?true:false;
    $scope.customCart = jQuery( window ).width() <= 992?true:false;
    $scope.pax = []; for(var j=1;j<30;j++) $scope.pax.push(j);
    jQuery( window ).scroll(function(){
        clearTimeout(customTimer);
        customTimer = setTimeout(function(){ 
            //console.log( jQuery('body').scrollTop() );
            if( jQuery('body').scrollTop() > 250 ){
                $scope.PIwidth = jQuery('.paymentInformation').parent().width() + 'px';
                $scope.fixedItem = true;
            }else{
                $scope.fixedItem = false;
                $scope.PIwidth = 'auto';
            }
            //console.log($scope.fixedItem + '  --  ' + $scope.PIwidth);
            $scope.$apply();
        }, 0);
    });
    jQuery( window ).resize(function(){
        clearTimeout(customTimer);
        customTimer = setTimeout(function(){ 
            $scope.customCartShow = jQuery( window ).width() > 992?true:false;
            $scope.customCart = jQuery( window ).width() <= 992?true:false;
            $scope.PIwidth = jQuery('body').scrollTop() > 250?jQuery('.paymentInformation').parent().width() + 'px':'auto';
            $scope.fixedItem = jQuery('body').scrollTop() > 250?true:false;
            $scope.$apply();
        }, 100);
    });
    $scope.steps = 1;
    $scope.setSteps = function(action,set){
        if( $scope.theclient && $scope.theclient.id ){
            if(set)
                $scope.steps = $scope.steps!=set?set:0;
            else
                $scope.steps += action=='next'?1:-1;
            $scope.steps = $scope.steps>5||$scope.steps<1?1:$scope.steps;
        }else{
            $scope.steps = 1;
            //$scope.alertMessage.show = true;
            //$scope.alertMessage.message = "El usuario debe de ser creado o seleccionado antes de continuar al siguiente paso.";
        }
    };
    $scope.validateItem = function(item,type){
        if(type=='tour')
            validateTour(item);
        if(type=='hotel')
            validateHotel(item);
    };
    var validateTour = function(item){
        if( item.startDate && ( item.pax || item.kidPax ) && item.fee && item.departureTime )
            item.saved = true;
        else{
            item.saved = false;
            //$scope.alertMessage.show = true;
            //$scope.alertMessage.message = 'Campos inválidos, revisar el tour antes de continuar.';
        }
    };
    var validateHotel = function(item){
        if( item.startDate && item.pax && item.fee && item.endDate && item.roomType && item.roomsNumber ){
            item.saved = true;
        }else{
            item.saved = false;
            //$scope.alertMessage.show = true;
            //$scope.alertMessage.message = 'Campos inválidos, revisar el Hotel antes de continuar.';
        }
    };
    $scope.addTH = function(type,item){
        if( typeof $scope.client != 'string' && ! angular.equals( {} , $scope.client ) ){
            //console.log('addedTour');console.log($scope.addedTour);
            if( type=='tour' && item ){
                //console.log(item);
                for(var x in item.schedules){
                    var aux = false;
                    item.schedules[x] = typeof item.schedules[x] == 'string'?JSON.parse(item.schedules[x]):item.schedules[x];
                    aux = new Date(item.schedules[x].from);
                    item.schedules[x].from = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                    aux = new Date(item.schedules[x].to);
                    item.schedules[x].to = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                }
                console.log(item);
                $scope.reservations.tours = $scope.reservations.tours.concat({tour:item, reservation_type : 'tour' , client : $scope.client });
            }else if( type=='hotel' && $scope.addedHotel ){
                $scope.reservations.hotels = $scope.reservations.hotels.concat({hotel:$scope.addedHotel, reservation_type : 'hotel' , client : $scope.client });
            }
            //updateReservationsGeneralFields(type);
        }else{
            $scope.alertM.show = true;
            $scope.alertM.client = true;
        }
    };
    $scope.removeTH = function(index,type){
        if( type=='tour' && $scope.reservations.tours[index] )
            $scope.reservations.tours.splice(index,1);
        if( type=='hotel' && $scope.reservations.hotels[index] )
            $scope.reservations.hotels.splice(index,1);
    };
    $scope.content = content;
    $scope.order = order;
    $scope.thecompany = ordercompany;
    $scope.theclient = theclient;
    $scope.user = user;
    $scope.hotels = hotels;
    $scope.clients_ = clients_;
    $scope.transfers = transfers;
    $scope.airports = false;
    $scope.transfer = false;
    $scope.transfer_bk = false;
    $scope.dtfa = [true,true]; //habilita / inhabilita las cajas de fecha 0:arrival 1:departure
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ 
        { handle : 'creditcard' , name : 'Tarjeta de crédito' }
        ,{ handle : 'paypal' , name : 'Paypal' }
        ,{ handle : 'cash' , name : 'Efectivo' }
        ,{ handle : 'prepaid' , name : 'Prepago' }
    ];
    $scope.service_types = [ {value:'C',label:'Colectivo'}, {value:'P',label:'Privado'}, {value:'D',label:'Directo'} ];
    $scope.reservations = { tours : [] , hotels : [] };
    $scope.flag_priceupdated = false;
    //console.log($scope.order);
    $scope.getAllTours = function(){
        var skip = $scope.toursCurrentPage?($scope.toursCurrentPage-1) * 5 : 0;
        var url = $scope.thecompany.adminCompany?'/tour/find':'/tour/findProducts/';
        var params = { skip : skip, limit : 5 , company : $scope.thecompany.id , adminCompany : $scope.thecompany.adminCompany||false };
        if($scope.searchTours!='') params.name = $scope.searchTours;
        $http.get( url , { params: params } ).then(function(response){
            //console.log(response.data);
            $scope.allTours = response.data;
            //console.log($scope.allTours);
        });
    };
    $scope.getAllTours();
    $scope.theTotal = 0;
    var updateTotal = function(){
        var total = 0;
        total += $scope.transfer.fee||0;
        for(var x in $scope.reservations.tours)
            total += $scope.reservations.tours[x].fee;
        for(var x in $scope.reservations.hotels)
            total += $scope.reservations.hotels[x].fee;
        $scope.theTotal = total;
    };
    $scope.formatReservations = function(){
        //console.log($scope.order);
        for(var x in $scope.order.reservations){
            var reserve = $scope.order.reservations[x];
            if( reserve.reservation_type == 'transfer' ){
                $scope.transfer = reserve;
                $scope.getTransfers();
            }else if( reserve.reservation_type == 'tour' ){
                for(var x in reserve.tour.schedules){
                    var aux = false;
                    reserve.tour.schedules[x] = typeof reserve.tour.schedules[x] == 'string'?JSON.parse(reserve.tour.schedules[x]):reserve.tour.schedules[x];
                    aux = new Date(reserve.tour.schedules[x].from);
                    reserve.tour.schedules[x].from = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                    aux = new Date(reserve.tour.schedules[x].to);
                    reserve.tour.schedules[x].to = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                }
                for(var x in reserve.tour.departurePoints){
                    var aux = false;
                    reserve.tour.departurePoints[x] = typeof reserve.tour.departurePoints[x] == 'string'?JSON.parse(reserve.tour.departurePoints[x]):reserve.tour.departurePoints[x];
                    aux = new Date(reserve.tour.departurePoints[x].time);
                    reserve.tour.departurePoints[x].time = aux.getHours() + ':' + (aux.getMinutes()==0?'00':aux.getMinutes());
                }
                //console.log('tour');
                //console.log(reserve);
                //console.log(reserve.departureTime);
                //console.log(reserve.departurePlace);
                $scope.reservations.tours.push(reserve);
            }else if( reserve.reservation_type == 'hotel' )
                $scope.reservations.hotels.push(reserve);
        }
        for(var x in $scope.reservations.hotels){
            $http({method: 'GET', url: '/hotel/'+$scope.reservations.hotels[x].hotel.id}).success(function (result){
                $scope.reservations.hotels[x].hotel.rooms = result.rooms;
                $scope.getPriceHotel($scope.reservations.hotels[x]);
            });
        }
        $scope.transfer_bk = $scope.transfer;
        //console.log($scope.reservations.tours);
        updateTotal();
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
        if( $scope.transfer && $scope.transfer.hotel ){
            var params = { byId : true , 'id' : ($scope.transfer.hotel.location.id || $scope.transfer.hotel.location) };
            $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){ 
                $scope.airports = result;
                $scope.transfer.airport = $scope.airports[0];
                $scope.getTransfers(); 
            });
        }
    }
    $scope.updateTourPrice = function(item){
        console.log(item);
        item.flag_priceupdated = true;
        if( item.usePrice || !item.saved ){
            item.fee = item.tour.fee&&item.pax?item.tour.fee*item.pax:0;
            item.fee += item.tour.feeChild&&item.kidPax?item.tour.feeChild*item.kidPax:0;
            console.log('Use new prices');
        }else{
            item.fee = item.fee_adults&&item.pax?item.fee_adults*item.pax:0;
            item.fee += item.fee_kids&&item.kidPax?item.fee_kids*item.kidPax:0;
            console.log('Use old prices');
        }
        if( item.currency && $scope.thecompany.base_currency.id != item.currency.id ){
            if( item.useER )
                item.fee *= $scope.thecompany.exchange_rates[item.currency.id].sales;
            else
                item.fee *= item.exchange_rates[item.currency.id].sales;
        }
        updateTotal();
    }
    //Obtiene el precio cada que se hace una modificación elegida
    //tenemos que obtener el prcio con porcentaje en el caso de las agencias
    $scope.updatePriceTransfer = function(){
        if($scope.transfer){
            $scope.flag_priceupdated = true;
            //$scope.transfer = $scope.transfer.transferprice.transfer || $scope.transfer.transfer;
            var transfer = $scope.transfer;
            //console.log('update price');
            if( transfer.hotel && transfer.airport && transfer.type ){
                var mult = transfer.pax ? ( Math.ceil( transfer.pax / transfer.transferprice.transfer.max_pax ) ):1;
                //console.log( 'mult: ' + mult + ' price: ' + transfer.transfer[transfer.type] );
                if( !transfer.usePrice && $scope.transfer_bk.hotel && transfer.hotel.zone == $scope.transfer_bk.hotel.zone && transfer.airport.zone == $scope.transfer_bk.airport.zone ){
                    $scope.transfer.fee = parseFloat( transfer.type=='one_way'?transfer.fee_adults:transfer.fee_adults_rt ) * mult;
                    console.log('usar precios guardados');
                }else{
                    $scope.transfer.fee = parseFloat(transfer.transferprice[transfer.type]) * mult;
                    $scope.transfer.fee_adults = transfer.transferprice.one_way;
                    $scope.transfer.fee_adults_rt = transfer.transferprice.round_trip;
                    $scope.transfer.fee_kids = transfer.transferprice.one_way_child;
                    $scope.transfer.fee_kids_rt = transfer.transferprice.round_trip_child;
                    console.log('usar precios nuevos');
                }
                if( transfer.currency && $scope.thecompany.base_currency.id != transfer.currency.id ){
                    if( $scope.transfer.useER ){
                        $scope.transfer.fee *= $scope.thecompany.exchange_rates[transfer.currency.id].sales;
                        $scope.transfer.exchange_rates = $scope.thecompany.exchange_rates;
                        console.log('usar ER nuevos');
                    }else{
                        $scope.transfer.fee *= transfer.exchange_rates[transfer.currency.id].sales;
                        console.log('usar ER guardados');
                    }
                }
                //console.log(transfer);
            }else{
                $scope.transfer.fee = 0;
            }
            $scope.updateDatesFormat();
            if( transfer.arrival_time )
                transfer.arrivalpickup_time = getpickuptime(transfer,'arrival');
            if( transfer.departure_time )
                transfer.departurepickup_time = getpickuptime(transfer,'departure');
            updateTotal();
        }
    };
    //obtiene los servicios que están disponibles dependiendo de las zonas que se elijan 
    $scope.getTransfers = function(){
        //console.log($scope.transfer);
        if( $scope.transfer && $scope.transfer.hotel && $scope.transfer.hotel.zone && $scope.transfer.airport && $scope.transfer.airport.zone ){
            var params = { 
                zone1 : ($scope.transfer.hotel.zone.id?$scope.transfer.hotel.zone.id:$scope.transfer.hotel.zone) , 
                zone2 : $scope.transfer.airport.zone ,
                company : $scope.thecompany
            };
            //console.log(params);
            //$http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
            $http.post('/order/getAvailableTransfers', params , {}).success(function (result){
                //console.log('prices');console.log(result);
                $scope.transfers = result;
                //console.log('transfers available');console.log(result);
            });
        }
    };
    $scope.printClient = function(){
        //console.log($scope.transfer.client);
    };
    $scope.saveAll = function(){
        if( $scope.transfer!=false && ! angular.equals( {} , $scope.transfer ) )
            $scope.reservationTransfer();
        if( $scope.reservations.tours.length>0 )
            $scope.reservationTours();
        if( $scope.reservations.hotels.length>0 )
            $scope.reservationHotels();
        return true;
    };
    $scope.reservationTransfer = function(){
        var params = {item : $scope.transfer};
        console.log('transfer');console.log($scope.transfer);
        if( $scope.order && ( $scope.transfer.transfer || $scope.transfer.transferprice ) && $scope.transfer.hotel ){
            //params.item.transfer = $scope.transfer.transfer.transfer.id;
            //console.log('transfer params');console.log(params);
            if( $scope.transfer.id ){
                params.item.hotel = $scope.transfer.hotel.id || false;
                params.item.transfer = $scope.transfer.transferprice.transfer?$scope.transfer.transferprice.transfer:$scope.transfer.transfer.transfer;
                if( $scope.generalFields ){
                    params.state = $scope.generalFields.state;
                    params.payment_method = $scope.generalFields.payment_method;
                    params.autorization_code = $scope.generalFields.autorization_code;
                    params.currency = $scope.generalFields.currency;
                }
                $http.post('/reservation/update/',params).success(function(result) {
                    console.log('Update transfer');
                    console.log(result);
                });
            }else{
                params = $scope.transfer;
                params.order = $scope.order.id;
                params.reservation_type = 'transfer';
                params.client = $scope.theclient;
                params.transfer = $scope.transfer.transferprice.transfer.id;
                params.transferprice = $scope.transfer.transferprice.id;
                if( $scope.generalFields ){
                    params.state = $scope.generalFields.state;
                    params.payment_method = $scope.generalFields.payment_method;
                    params.autorization_code = $scope.generalFields.autorization_code;
                    params.currency = $scope.generalFields.currency;
                }
                /*params.payment_method = params.payment_method || 'creditcard';
                params.currency = params.currency || $scope.thecompany.base_currency;
                params.autorization_code = params.autorization_code || '';*/
                //console.log($scope.transfer);console.log(params);
                for(var x in $scope.transfer.contacts)
                    $scope.transfer.contacts[x] = $scope.theclient.contacts[$scope.transfer.contacts[x]];
                $http.post('/order/createReservation',params,{}).success(function(result) {
                    //console.log('create transfer reservation');console.log(result);
                });
            }
        }
    };
    $scope.reservationTours = function(){
        var params = { items : $scope.reservations.tours };
        $http.post('/order/updateReservation',params,{}).success(function(result) {
            console.log('Update tours');console.log(result);
        });
    }
    $scope.reservationHotels = function(){
        var params = { items : $scope.reservations.hotels };
        $http.post('/order/updateReservation',params,{}).success(function(result) {
            console.log('Update hotels');console.log(result);
        });
    };
    //Obtener el número máximo de personas para un cuarto
    $scope.getPaxHotel = function(item,pax){
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
                $scope.getPaxHotel(item,room.pax);
                var daysNumber = 1;
                if( item.startDate && item.endDate ){
                    var start = moment(item.startDate);
                    var end = moment(item.endDate);
                    daysNumber = end.diff(start,'days');
                    //console.log(daysNumber);
                }
                if( item.hotel.seasonScheme && item.roomType && room.seasonal == 'true' ){
                  var params = {
                    seasonScheme : item.hotel.seasonScheme, room : item.roomType ,
                    startDate : item.startDate.toISOString(), endDate : item.endDate.toISOString()
                  };
                  $http.post('/hotel/getprice',params,{}).success(function(price) {
                    item.fee = item.roomsNumber*((price && price != '0')?price:room.fee);
                    item.fee = parseFloat(item.fee.replace('"',''));
                    item.fee *= daysNumber;
                  });
                }else{
                  item.fee = item.roomsNumber*(room.fee?parseFloat(room.fee.replace('"','')):0);
                  item.fee *= daysNumber;
                }
            });
        }
    };
    $scope.formatReservations();
    $scope.getAirports();
    $scope.getTransfers();
    $scope.updateDatesFormat();
    //$scope.printClient();
    $scope.getHotels = function(val){
        return $http.get('/hotel/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.getAirlines = function(val){
        return $http.get('/airline/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.setTheItemForContacts = function(item,type,index){
        $scope.theIFC = item;
    };
    $scope.theIFC = false;
    $scope.formatDate = function(date){
        return moment(date).format('L');
    };
    $scope.getDiffDates = function(start,end){
        var result = '';
        if(start && end){
            var start = moment(start);
            var end = moment(end);
            result = end.diff(start,'days');
        }
        return result;
    };
    $scope.updateOrderDate = function(){
        if( $scope.orderUpdate ){
            var params = { id : $scope.order.id, newDate : $scope.orderUpdate,  }
            $http.post('/order/updateOrderDate',params,{}).success(function(results) {
                console.log(results);
                if( results.result ){ 
                    $scope.customMessages.ouds.show = true;
                    $scope.reservationCollapse = !$scope.reservationCollapse
                }else{
                    $scope.customMessages.oude.show = true;
                }
            });
        }else{
            //$scope.customMessages.oude.xmessage = r1;
            $scope.customMessages.oude.show = true;
        }
    }
    $scope.customMessages = {
        oude : { show : false , type : 'alert' , message : "Selecciona una fecha para poder continuar" }
        ,ouds : { show : false , type : 'alert alert-success' , message : "La fecha ha sido actualizada" }
    };
});
app.controller('orderQuickCTL',function($scope,$http,$window,$rootScope){
    $scope.DatepickerOptions = {
        minDate : new Date()
    };
    $scope.DatepickerOptions.minDate.setDate( $scope.DatepickerOptions.minDate.getDate() + 1 );
    $scope.company = company;
    $scope.companies = [];
    $scope.thecompany = $scope.company;
    $scope.order = false;
    $scope.client_flag = false;
    $scope.hrevState = [{ handle : 'pending' , name : 'Pendiente' } , { handle : 'liquidated' , name : 'Liquidado' }, { handle : 'canceled' , name : 'Cancelado' }];
    $scope.hrevPayment = [ 
        { handle : 'creditcard' , name : 'Tarjeta de crédito' }
        ,{ handle : 'paypal' , name : 'Paypal' }
        ,{ handle : 'cash' , name : 'Efectivo' }
        ,{ handle : 'prepaid' , name : 'Prepago' }
    ];
    $scope.open = [false,false]; //abre/cierra los datepickers
    $scope.pax = [];
    $scope.kidPax = [];
    for(var j=0;j<20;j++){ 
        if( j>0 ) $scope.pax.push(j);
        $scope.kidPax.push(j);
    }
    $scope.searchBy = 'c';
    $scope.customMessages = {
        Tta : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg1 }
        ,Ttd : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg2 }
        ,TH  : { show : false , type : 'alert' , message : $rootScope.translates.c_ordermessg3 }
        ,rcs : { 
            show : false , type : 'alert' , message : 'La reserva se ha creado con éxito.' 
            , buttons : [
                { label : 'Ver reserva' , action : function(){ redirectToEdit('edit'); } }
                ,{ label : 'Ver todas las reservas' , action : function(){ redirectToEdit('list'); } }
            ]
        }
        ,rcf : { show : false , type : 'alert' , message : 'Ha ocurrido un error al crear la reserva, favor de revisar los campos e intentar de nuevo.' }
    };
    $scope.alertMessage = { show : false , title : '' , message : '' , type : 'alert' };
    $scope.theCupon = { cupon : {} , token : '' };
    $scope.resetForm = function(){
        $scope.transfer = false;
        $scope.client = false;
    };
    //Crea un cliente en caso de que sea uno nuevo
    $scope.createUpdateClient = function(){
        var action = "/order/createClient";
        if(!$scope.client_flag) $scope.client.company = $scope.thecompany.id;
        else action = "/order/updateClient";
        $http.post(action,$scope.client,{}).success(function(client_) {
            $scope.client = client_;
            $scope.client_flag = true;
        });
    };
    $scope.saveAll = function(){
        //crear una orden
        if( typeof $scope.client != 'string' && ! angular.equals( {} , $scope.client ) ){
            if( ! angular.equals( {} , $scope.transfer ) ){
                if( $scope.transfer != false && !angular.equals( {} , $scope.transfer ) ) {
                    var arrivalDate = new Date($scope.transfer.arrival_date);
                    var departureDate = new Date($scope.transfer.departure_date);
                    if (arrivalDate > departureDate) {
                        $scope.alertM.show = true;
                        $scope.alertM.date = true;
                        return;
                    }
                }
                var params = { 
                    client : $scope.client 
                    ,company : $scope.thecompany.id
                };
                if( $scope.theCupon.cupon ) params.token = $scope.theCupon.token;
                console.log('create order');
                console.log(params);
                $http.post('/order/createOrder',params,{}).success(function(order) {
                    if(order && order.id){
                        $scope.order = order;
                        //ver si existe transfer
                        if(  $scope.transfer != false && ! angular.equals( {} , $scope.transfer ) && $scope.transfer.fee ){
                            $scope.reservationTransfer();
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
            $scope.showMessage('tcf');
        }
    };
    $scope.saveTourReservation = function( form ){
        if( form.$valid && $scope.reservationTour.fee ){
            var params = $scope.reservationTour;
            params.company = $scope.thecompany;
            params.reservation_type = 'tour';
            params.generalFields = {};
            if( $scope.theCupon.cupon ) params.token = $scope.theCupon.token;
            console.log('create order');
            console.log(params);
            $http.post('/order/createquickreservation',params,{}).success(function(result) {
                if( result.results )
                $scope.showMessage('rcs');
                //$scope.redirectToEdit( );
            });
        }else{
            $scope.showMessage('tcf');
        }
    }
    $scope.reservationTransfer = function(){
        var params = $scope.transfer;
        if( $scope.order ){
            params.order = $scope.order.id;
            params.reservation_type = 'transfer';
            params.client = $scope.client;
            params.transferprice = $scope.transfer.transfer.id;
            params.transfer = $scope.transfer.transfer.transfer.id;
            for(var x in $scope.transfer.contacts)
                $scope.transfer.contacts[x] = $scope.client.contacts[$scope.transfer.contacts[x]];
            $http.post('/order/createReservation',params,{}).success(function(result) {
                $scope.showMessage('rcs');
                //$scope.redirectToEdit( );
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
        /*var h = $scope.transfer.origin == 'hotel'?true:false;
        var r = $scope.transfer.type == 'round_trip'?true:false;
        $scope.dtfa[0] = ( h && r ) || (!h);
        $scope.dtfa[1] = ( !h && r ) || h;*/
    };
    //Obtener el número máximo de personas para un cuarto
    $scope.getPaxHotel = function(item,pax){
        var i, res = [] , max = 10, resChildren = [];
        if( pax ) max = pax;
        max = max * item.roomsNumber;
        for (i = 1; i <= max ; i++) res.push(i);
        for (i = 0; i <= ( max - (item.pax||0) ) ; i++) resChildren.push(i);
        item.hotel.maxApax = res; 
        item.hotel.maxCpax = resChildren;
    };
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePriceTransfer = function(){
        console.log($scope.transfer)
        if(!$scope.transfer.currency)
            $scope.transfer.currency = $scope.thecompany.base_currency;
        var transfer = $scope.transfer;
        if( transfer.hotel && transfer.airport && transfer.type ){
            var mult = transfer.pax?( Math.ceil( transfer.pax / transfer.transfer.transfer.max_pax ) ):1;
            $scope.transfer.fee = transfer.transfer[transfer.type] * mult;
            if( $scope.transfer.currency.id != $scope.thecompany.base_currency.id )
                $scope.transfer.fee *= $scope.thecompany.exchange_rates[$scope.transfer.currency.id].sales;
        }else{
            $scope.transfer.fee = 0;
        }
        $scope.updateDatesFormat();
        if( transfer.arrival_time )
            transfer.arrivalpickup_time = getpickuptime(transfer,'arrival');
        if( transfer.departure_time )
            transfer.departurepickup_time = getpickuptime(transfer,'departure');
        updateTotal();
    };
    //Se calcula de nuevo el precio cuando cambia de tour, número de pax o agencia
    $scope.updatePriceTour = function(){
        console.log('get tour prices');
        if( $scope.reservationTour.tour && $scope.reservationTour.tour.id ){
            if(!$scope.reservationTour.currency)
                $scope.reservationTour.currency = $scope.thecompany.base_currency;
            if( !$scope.reservationTour.pax ) $scope.reservationTour.pax = 1;
            $scope.reservationTour.fee = $scope.reservationTour.pax * $scope.reservationTour.tour.fee;
            if( $scope.reservationTour.kidPax ) 
                $scope.reservationTour.feeKids = $scope.reservationTour.kidPax * $scope.reservationTour.tour.feeChild;
            else
                $scope.reservationTour.feeKids = 0;
            if( $scope.reservationTour.currency.id != $scope.thecompany.base_currency.id ){
                $scope.reservationTour.fee *= $scope.thecompany.exchange_rates[$scope.reservationTour.currency.id].sales;
                $scope.reservationTour.feeKids *= $scope.thecompany.exchange_rates[$scope.reservationTour.currency.id].sales;
            }
            if( $scope.theCupon.cupon ){
                console.log( typeof $scope.theCupon.cupon.gral_discount );
                if( typeof $scope.theCupon.cupon.gral_discount == 'string' )
                    $scope.theCupon.cupon.gral_discount = parseInt($scope.theCupon.cupon.gral_discount)/100;
                console.log( $scope.theCupon.cupon.gral_discount );
                if( $scope.theCupon.cupon.allTours ){
                    console.log('all tours');
                    $scope.reservationTour.fee = $scope.reservationTour.fee - ($scope.reservationTour.fee*$scope.theCupon.cupon.gral_discount);
                    $scope.reservationTour.feeKids = $scope.reservationTour.feeKids - ($scope.reservationTour.feeKids*$scope.theCupon.cupon.gral_discount);
                    console.log($scope.reservationTour.fee);
                    console.log($scope.reservationTour.feeKids);
                }else{
                    for( var x in $scope.theCupon.cupon.tours ){
                        if( $scope.reservationTour.tour.id == $scope.theCupon.cupon.tours[x].id ){
                            console.log('in array of tours');
                            $scope.reservationTour.fee = $scope.reservationTour.fee - ($scope.reservationTour.fee*$scope.theCupon.cupon.gral_discount);
                            $scope.reservationTour.feeKids = $scope.reservationTour.feeKids - ($scope.reservationTour.feeKids*$scope.theCupon.cupon.gral_discount);
                            break;
                        }
                    }
                }
            }
        }
    }
    $scope.getpickuptime = function(){
        var transfer = $scope.transfer;
        if( transfer.arrival_time )
            transfer.arrivalpickup_time = getpickuptime(transfer,'arrival');
        if( transfer.departure_time )
            transfer.departurepickup_time = getpickuptime(transfer,'departure');
    };
    //obtiene los servicios que están disponibles dependiendo de las zonas que se elijan 
    $scope.getTransfers = function(){
        if( $scope.transfer.hotel.zone.id && $scope.transfer.airport.zone ){
            var params = { 
                zone1 : $scope.transfer.hotel.zone.id
                ,zone2 : $scope.transfer.airport.zone 
                ,company : $scope.thecompany
            };
            $http.post('/order/getAvailableTransfers', params , {}).success(function (result){
                console.log('prices');console.log(result);
                $scope.transfers = result;
            });
        }
    };
    $scope.validateDates = function(){
        if( $scope.transfer && ! angular.equals( {} , $scope.transfer ) )
            validateTt();
    };
    $scope.getHotels = function(val){
        return $http.get('/hotel/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.getTours = function(val){
        var url = $scope.thecompany.adminCompany?'/tour/find':'/tour/findProducts/';
        var params = { limit : 15 , company : $scope.thecompany.id , adminCompany : $scope.thecompany.adminCompany||false };
        if( $scope.searchBy == 'n' ) params.name = val;
        if( $scope.searchBy == 'c' ) params.mkpid = val;
        if( $scope.searchBy == 'p' ) params.providerCode = val;
        return $http.get(url, { params: params }).then(function(response){
            console.log(response);
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.getClients = function(val){
        return $http.get('/client/find', { params: { name: val , company : $scope.thecompany.id } }).then(function(response){
            return response.data.map(function(item){ return item; });
        });
    };
    $scope.getAirlines = function(val){
        return $http.get('/airline/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    var getCompanies = function(){
        $http.post('/company/find',{limit:20,sort:'createdAt'},{}).success(function(result) {
            //console.log('get companies');console.log(result);
            $scope.companies = result.results;
        });
        //$scope.companies
    };
    getCompanies();
    $scope.saveContact = function(){
        if($scope.client && $scope.contact.name && $scope.contact.email && $scope.contact.phone ){
            $scope.contact.client = $scope.client.id;
            //$http({method: 'POST', url: '/client/add_contact2',params:$scope.contact}).success(function (result){
            $http.post('/client/add_contact2',$scope.contact,{}).success(function(result) {
                $scope.contact.contact = result.contacts;
                //console.log(result);
            });
        }
    };
    var getRange = function(number){
        console.log('getrange: ' + number);
        var result = [];
        if( number && number>0 )
            for( x = 0; x < number; x++ )
                result.push(x);
        return result;
    };
    $scope.formatDate = function(date){
        return moment(date).format('L');
    }
    $scope.getDiffDates = function(start,end){
        var result = '';
        if(start && end){
            var start = moment(start);
            var end = moment(end);
            result = end.diff(start,'days');
        }
        return result;
    };
    var updateTotal = function(){
        var total = 0;
        total += $scope.transfer.fee||0;
        $scope.theTotal = total;
    };
    //abre/cierra datepickers
    $scope.open = function($event,var_open) {
        $event.preventDefault();$event.stopPropagation();
        $scope.open[var_open] = true;
    };
    $scope.showMessage = function(action){
        $scope.alertMessage.buttons = [ { label : 'Ok' , action : function(){ $scope.alertMessage.show=false; } } ];
        $scope.alertMessage.title = 'Error en la orden';
        if( action == 'rcs' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'La reserva se ha creado con éxito.';
            $scope.alertMessage.buttons = [ 
                { label : 'Ver reserva' , action : function(){ redirectToEdit('edit'); } }
                ,{ label : 'Ver todas las reservas' , action : function(){ redirectToEdit('list'); } }
            ];
            $scope.alertMessage.classType = 'alert-successCustom';
            $scope.alertMessage.title = 'Mensaje de la reserva';
        }
        if( action == 'ucf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = "El usuario debe de ser creado o seleccionado antes de continuar al siguiente paso.";
        }
        if( action == 'trcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos incompletos, revisar el traslado antes de continuar.';
        }
        if( action == 'tcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos inválidos, revisar el Tour antes de continuar.';
        }
        if( action == 'hcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos inválidos, revisar el Hotel antes de continuar.';
        }
    };
    var redirectToEdit = function(action){
        if( action == 'edit' )
            $window.location =  "/order/edit/" + $scope.order.id;
        if( action == 'list' )
            $window.location =  "/order/";
    };
    $scope.validateCupon = function(){
        //$scope.theCupon = { cupon : {} , token : '' };
        if( $scope.theCupon.token && $scope.theCupon.token != '' ){
            $http.post('/order/validatecupon', {token:$scope.theCupon.token}, {}).success(function(result){
                if( result.cupon && result.single ){
                    $scope.theCupon.cupon = result.cupon;
                    $scope.theCupon.single = result.single;
                    $scope.updatePriceTour();
                }
                else if( result.err && result.err == 'max_times' )
                    console.log('Este cupón ya se ha instanciado el máximo de veces');
                console.log(result);
                console.log($scope.theCupon);
            });
        }
    }
});
/*
    Calcula el tiempo de pickup dependiendo del origen
    Order: orden generando para tener todos los datos
    Type: arrival o departure
*/
var getpickuptime = function(order,type){
    var result = false;
    if(type=='departure' && order.hotel && order.departure_time && order.departure_date){
        var aux = new Date(order.departure_time);
        var adate = new Date(order.departure_date);
        adate.setHours(aux.getHours());
        adate.setMinutes(aux.getMinutes());
        var d = moment(adate.toISOString());
        console.log('Hrs: ' + order.hotel.zone.pickup_hrs);
        d.subtract(parseInt(order.hotel.zone.pickup_hrs),'hours');
        result = d.format();
    }
    if( type=='arrival' && order.arrival_time && order.arrival_date ){
        var aux = new Date(order.arrival_time);
        var adate = new Date(order.arrival_date);
        adate.setHours(aux.getHours());
        adate.setMinutes(aux.getMinutes());
        var d = moment(adate.toISOString());
        result = d.format();
    }
    return result;
}
