app.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
app.controller('transportAsignCTL',function($scope, $http, $rootScope, $compile, uiCalendarConfig, chroma, $filter,$window){
    var timeZone = 'America/Mexico_City';
    moment.tz.add(timeZone+'|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

    //varibales para solicitud de servicio
    $scope.dtfa = [true,true];
    $scope.all_companies = window.all_companies;
    console.log($scope.companies);
    $scope.pax = [];
    for(var j=1;j<( 30 );j++) $scope.pax.push(j);
    $scope.open = [false,false]; //abre/cierra los datepickers
    $scope.alertMessage = { show : false , title : '' , message : '' , type : 'alert' };
    //terminan variables nuevas
    var on = {},
    current_lang = window.current_lang || 'es';
    $scope.view_type = window.view_type;

    $scope.location = {};
    if($scope.view_type == 'request'){
        $scope.locations = window.locations;
        console.log(window.locations);
    }else{
    //if($scope.view_type == 'request'){
        $http.get('/location/find').then(function(res){
            $scope.locations = res && res.data || [];
        });

        $http.get('/zone/find?populate&limit=200').then(function(res){
            $scope.zones = res && res.data || [];
        });

        $http.get('/transportprice/find').then(function(res){
            $scope.prices = res && res.data || [];
        });

    }

    $scope.filter_zones = {};
    $scope.changeLocation = function(type){
        $scope.filter_zones[type] = $filter('filter')($scope.zones, function(val){
                                return val.location == $scope.location[type];
                            });
    };

    $scope.filter_price = function(zoneFrom, zoneTo, service_type){
        zoneFrom = zoneFrom || $scope.modal.zoneFrom;
        zoneTo = zoneTo || $scope.modal.zoneTo;
        service_type = service_type || $scope.modal.service_type;
        if(zoneFrom && zoneTo && service_type){
            return $filter('filter')($scope.prices, function(pr){
                return pr.zoneFrom.id == zoneFrom && pr.zoneTo.id == zoneTo && pr.service_type == service_type;
            });
        }
        return [];
    };

    on.eventClick = function(even, jsEvent, view, revertFunc){
        console.log(even);
        $scope.location = {};
        var start = moment(even.start).tz(timeZone),
            end = moment(even.end).tz(timeZone);
        if(!end.isValid())
            end = start.add(1, 'hour');
        $scope.modal = {
            start: start.toDate(),
            end: end.toDate(),
            company: even.transport && even.transport.company,
            transport: even.transport && even.transport.id,
            service_type: even.asign.service_type,
            pax: even.asign.pax,
            fee: even.asign.fee,
            asign: even.asign,
            event: even,
            revertFunc: revertFunc || false
        };
        if(!$scope.companies.length){
            $http.get('/transportAsign/show_companies').then(function(res){
                if(res && res.data)
                    $scope.companies = res.data;
            });
        }
        $scope.changeCompany();
        $scope.location.from = even.asign.zoneFrom.location;
        $scope.location.to = even.asign.zoneTo.location;
        $scope.changeLocation('from');
        $scope.changeLocation('to');
        $scope.modal.zoneFrom = even.asign.zoneFrom.id;
        $scope.modal.zoneTo = even.asign.zoneTo.id;
        $scope.modal.price = even.asign.price && even.asign.price.id;
        jQuery('#select-transport-update').modal('show');

    };

    on.select = function(start, end){
        $scope.location = {};
    	var time = moment(start).tz(timeZone);
        $scope.modal = {};
        $scope.modal.day = time.format('YYYY/MM/DD');
        $scope.modal.start = time.toDate();
        $scope.modal.end = time.add(1, 'hour').toDate();
        jQuery('#select-transport').modal('show');
        getCompanies();
    }

    on.drop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        on.eventClick(event, jsEvent, view, revertFunc);
    };

     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

    //modal info
    $scope.modal = {};
    $scope.companies = [];
    $scope.transports = [];
    $scope.events = [];
    $scope.error = {};

    var cacheTransports = {};
    $scope.changeCompany = function(){
    	$scope.transports = [];
        var company = $scope.modal.company;
        if(!cacheTransports[company]){
            $http.get('/transport/find?company='+company).then(function(res){
                $scope.transports = cacheTransports[company] = res.data || [];
            });
        }else{
            $scope.transports = cacheTransports[company]; 
        }
    };

    function validDate(){
        var start = moment($scope.modal.start).tz(timeZone),
            end = moment($scope.modal.end).tz(timeZone);

        if(!end.isValid())
            return true;
        
        if(end.isAfter(start))
            return true;
        
        $scope.error.invalid_end = true;
        return false;
    }

    $scope.save = function(){
        $scope.error.invalid_end = false;
    	if(validDate())
            $http.post('/transportAsign/create', getFormParams()).then(function(res){
                if(res && res.data)
                    addEvent(res.data);
            });

    };

    $scope.update = function(){
        if(validDate()){
            $http.post('/transportAsign/'+$scope.modal.asign.id, getFormParams()).then(function(res){
                if(res && res.data){ 
                    var f = formatEven(res.data)[0]
                    var event = $scope.modal.event;
                    event.title = f.title;
                    event.asign = f.asign;
                    event.start = f.start;
                    event.end = f.end;
                    event.transport = f.transport;
                
                    jQuery('#mainCalendar').fullCalendar('updateEvent', event);
                    jQuery('#select-transport-update').modal('hide');
                }
            });
        }
    };

    function getFormParams(){
        var end = moment($scope.modal.end).tz(timeZone),
            start = moment($scope.modal.start).tz(timeZone);
        if(!end.isValid())
            end = start.add(1, 'hour');

        var params = {
                transport: $scope.modal.transport,
                start: start.toDate().toISOString(),
                end: end.toDate().toISOString(),
                service_type: $scope.modal.service_type,
                pax: $scope.modal.pax,
                zoneFrom: $scope.modal.zoneFrom,
                zoneTo: $scope.modal.zoneTo,
                fee: $scope.modal.fee,
                transfer: $scope.modal.transfer.transfer.id,
                price: $scope.modal.transfer.id,
            };
        //return params
        if($scope.view_type == 'asign'){
            params.price = $scope.modal.price;
            return params;
        }
        //params.pax = $scope.modal.pax;
        return params;
    }

    $scope.cancel = function(){
        /*if($scope.modal.revertFunc){
            $scope.modal.revertFunc();
        }*/
        jQuery('#select-transport-update').modal('hide');
        $scope.modal = {};
    };

    function addEvent(transportAsign){
        $http.get('/transportAsign/'+transportAsign.id).then(function(res){
            ts = res && res.data
            if(ts){
                $scope.events.push(formatEven(ts)[0])
                jQuery('#select-transport').modal('hide');
            }
        });
    }

    function getCompanies(){
        if(!$scope.companies.length){
            $http.get('/transportAsign/show_companies').then(function(res){
                if(res && res.data)
                    $scope.companies = res.data;
            });
        }
    
    }

    var is_spanish = current_lang == 'es'? true: false;
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 800,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next',
          left: 'month,basicWeek,agendaDay,basicDay'
        },
        contentHeight: 800,
        timeZone: 'America/Mexico_City',
        ignoreTimezone: false,
        selectable: true,
        defaultView: 'agendaDay',
        eventClick: on.eventClick,
        eventDrop: on.drop,
        //eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        select: on.select,
        allDaySlot: false,
        slotEventOverlap: false,
        dayNames: is_spanish ? ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: is_spanish ? ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames: is_spanish ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
        buttonText: is_spanish? {
            month: 'Mes',
            week: 'Semana',
            basicDay: 'Lista del dia',
            agendaDay: 'Dia por hora',
            today: 'Hoy'
        } : {
            month: 'Month',
            week: 'Week',
            basicDay: 'list of day',
            agendaDay: 'Day per hour',
            today: 'Today'
        }
      }
    };


    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, /*timezone*/ done) {
        var from = moment(start).tz(timeZone).toISOString(),
            to = moment(end).tz(timeZone).toISOString();
        $http.get('/transportAsign/find?where={"$and":[{"start":{">=":"'+from+'"}},{"start":{"<=":"'+to+'"}}]}').then(function(res){
            if(res && res.data && res.data[0]){
                $scope.events.forEach(function(){
                //eliminate exists
                $scope.events.pop();
            });
            done(formatEven(res.data));
        }
      });
    };

    function formatEven(transportAsigns, done){
        var list = transportAsigns.length && transportAsigns || [transportAsigns];

        return list.map(function(asign, index){
            var bg = chroma.chroma(chroma.chroma.random()).darken(2),
                color = 'white';

            if($scope.view_type == 'asign' && asign.transport){
                return {
                    asign: asign, 
                    transport: asign.transport, 
                    title: ' ID: ' + asign.transport.car_id + 
                            ' | transport: ' + getCompanyName(asign.transport.company) + 
                            ' | Placa: ' + asign.transport.license_plate +
                            ' | Max Pax:' + asign.transport.max_pax + 
                            (asign.pax? (' | Request Pax: ' + asign.pax) : '') +
                            ' | Request Type: ' + getServiceType(asign.service_type),
                    start: asign.start, 
                    end: asign.end, 
                    allDay: false, 
                    backgroundColor: bg, 
                    textColor: color, 
                    borderColor: 'black', 
                    className: 'even_hour'
                };
            }
            return {
                asign: asign, 
                transport: asign.transport, 
                title: 'Pax:' + asign.pax + ' | type: ' + getServiceType(asign.service_type),
                start: asign.start, 
                end: asign.end, 
                allDay: false, 
                backgroundColor: bg, 
                textColor: color, 
                borderColor: 'black', 
                className: 'even_hour'
            };

        });
    }

    function getServiceType(type){
        var f = _.find($scope.service_types, function(s){
                    return s.id == type;
                });
        return f && f.name || '';
    }

    function getCompanyName(company){
        var found = _.find(all_companies, function(a){
            if(a.id == company) return true;
        })
        return found && found.name || '';
    }

    $scope.eventSources = [$scope.events, $scope.eventsF];

    $scope.service_types = [
            { name : 'Colectivo' , id : 'C' }
            ,{ name : 'Privado' , id : 'P' }
            ,{ name : 'Lujo' , id : 'L' }
        ];
    //obtener los transfers/prices dependiendo de las zonas seleccionadas
    $scope.tranferPrices = false;
    $scope.getPrices = function(){
        if( $scope.modal.zoneFrom && $scope.modal.zoneTo ){
            var params = {
                zone1 : $scope.modal.zoneFrom
                ,zone2 : $scope.modal.zoneTo
            };
            $http.post('/transportAsignRequest/getprices', params ).then(function(res){
                console.log(res);
                $scope.tranferPrices = res.data;
                $scope.updatePrice();
            });
        }
    };
    //set the transfer by pax number
    var setTransferDefault = function(){
        /*$scope.modal.pax = $scope.modal.pax || 1;
        $scope.modal.type = $scope.modal.type || 'one_way';
        $scope.modal.service_type = $scope.modal.service_type || 'C';
        console.log('transfers');
        console.log($scope.modal);
        $scope.modal.transfer = false;
        if( $scope.tranferPrices.length > 0 ){
            var initMaxPax = 100;
            for( var x in $scope.tranferPrices ){
                if( $scope.modal.service_type == 'P' && $scope.tranferPrices[x].transfer.service_type == 'P' && $scope.modal.pax <= $scope.tranferPrices[x].transfer.max_pax && $scope.tranferPrices[x].transfer.max_pax <= initMaxPax ){
                    initMaxPax = $scope.tranferPrices[x].transfer.max_pax;
                    $scope.modal.transfer = $scope.tranferPrices[x];
                }
                if( $scope.modal.service_type == 'C' && $scope.tranferPrices[x].transfer.service_type == 'C' )
                    $scope.modal.transfer = $scope.tranferPrices[x];
            }
            console.log('if transfers');
            console.log($scope.modal);
        }*/
    }
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePrice = function(){
        //console.log($scope.transfer)
        //if(!$scope.transfer.currency)$scope.transfer.currency = $scope.thecompany.base_currency;
        setTransferDefault();
        var transfer = $scope.modal;
        if( transfer.transfer ){
            var mult = transfer.pax?( Math.ceil( transfer.pax / transfer.transfer.transfer.max_pax ) ):1;
            //console.log( 'mult: ' + mult + ' price: ' + transfer.transfer[transfer.type] );
            $scope.modal.fee = parseFloat(transfer.transfer[transfer.type]) * mult;
            //if( $scope.transfer.currency.id != $scope.thecompany.base_currency.id )
                //$scope.transfer.fee *= $scope.thecompany.exchange_rates[$scope.transfer.currency.id].sales;
        }else{
            $scope.modal.fee = 0;
        }
    };
    /*
        Funciones agregadas para la reserva de un servicio
    */
    $scope.theTotal = 0;
    var updateTotal = function(){
        $scope.theTotal = $scope.modal.fee||0;
    }
    //obtiene los aeropuertos dependiendo de la ciudad elegida
    $scope.getAirports = function(){
        var params = {'id':$scope.modal.hotel.location.id};
        $http({method: 'POST', url: '/airport/getAirport',params:params}).success(function (result){
            //console.log('airports');console.log(result);
            $scope.airports = result;
            $scope.modal.airport = $scope.airports[0];
            $scope.getTransfers();
            $scope.updatePriceTransfer();
        });
    };
    $scope.getHotels = function(val){ 
        return $http.get('/hotel/find', { params: { name: val } }).then(function(response){
            //console.log(response);
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.getAirlines = function(val){
        return $http.get('/airline/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    //Obtiene el precio cada que se hace una modificación elegida
    $scope.updatePriceTransfer = function(){
        console.log($scope.modal)
        if(!$scope.modal.currency)
            $scope.modal.currency = $scope.modal.company.base_currency;
        setTransferDefault();
        var transfer = $scope.modal;
        if( transfer.hotel && transfer.airport && transfer.type && transfer.transfer ){
            var mult = transfer.pax?( Math.ceil( transfer.pax / transfer.transfer.transfer.max_pax ) ):1;
            //console.log( 'mult: ' + mult + ' price: ' + transfer.transfer[transfer.type] );
            $scope.modal.fee = transfer.transfer[transfer.type] * mult;
            if( $scope.modal.currency.id != $scope.modal.company.base_currency.id )
                $scope.modal.fee *= $scope.modal.company.exchange_rates[$scope.modal.currency.id].sales;
        }else{
            $scope.modal.fee = 0;
        }
        $scope.updateOriginsFormat();
        updateTotal();
    };
    //Controla los inputs de fechas roundtrip/oneway
    $scope.updateOriginsFormat = function(){
        var h = $scope.modal.origin == 'hotel'?true:false;
        var r = $scope.modal.type == 'round_trip'?true:false;
        $scope.dtfa[0] = ( h && r ) || (!h);
        $scope.dtfa[1] = ( !h && r ) || h;
    };
    $scope.getArrivalDepartureAsigned = function(r){
        var result = '';
        if( r.asign ){
            var o           = r.origin == 'hotel'       ?true:false;
            var oText       = " Llegada <span class='" + ( r.asign.vehicle_arrival?"greenText'>asignada":"redText'>No asignada" ) + '</span>. ';
            var t           = r.type == 'round_trip'    ?true:false;
            var tText       = " Salida <span class='" + ( r.asign.vehicle_departure?"greenText'>asignada":"redText'>No asignada" ) + '</span>. ';
            result          = ( ( o && t ) || (!o)?oText:'' ) + ( ( !o && t ) || o?tText:'' );
        }
        return result;
    };
     //obtiene los servicios que están disponibles dependiendo de las zonas que se elijan 
    $scope.getTransfers = function(){
        //console.log('get transfers');console.log($scope.transfer);
        if( $scope.modal.hotel.zone && $scope.modal.airport.zone ){
            var params = { 
                zone1 : $scope.modal.hotel.zone.id || $scope.modal.hotel.zone
                ,zone2 : $scope.modal.airport.zone 
                ,company : $scope.modal.company
            };
            console.log('transfers params');
            console.log(params);
            //$http({method: 'POST', url: '/order/getAvailableTransfers',params:params}).success(function (result){
            $http.post('/order/getAvailableTransfers', params , {}).success(function (result){
                console.log('prices');console.log(result);
                $scope.transfers = result;
                if(!$scope.asignando) $scope.updatePriceTransfer();
            });
        }
    };
     //Va a crear la reserva del transfer
    $scope.saveAll = function(){
        //crear una orden
        if( typeof $scope.client != 'string' && ! angular.equals( {} , $scope.client ) ){
            if( ! angular.equals( {} , $scope.transfer ) ){
                var params = { 
                    client:$scope.client 
                    ,company : $scope.modal.company.id
                };
                $http.post('/order/createOrder',params,{}).success(function(order) {
                    //console.log('order');console.log(order);
                    if(order && order.id){
                        $scope.order = order;
                        reservationTransfer();
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
    var redirectToEdit = function(action){
        if( action == 'edit' )
            $window.location =  "/TransportAsignRequest/";
        if( action == 'list' )
            $window.location =  "/TransportAsign/";
    };
    var reservationTransfer = function(){
        var params = $scope.modal;
        if( $scope.order ){
            params.order = $scope.order.id;
            params.reservation_type = 'transfer';
            params.client = $scope.client;
            params.transferprice = $scope.modal.transfer; 
            params.transfer = $scope.modal.transfer.transfer.id;
            params.state = 'liquidated';
            params.company.base_currency = $scope.modal.company.base_currency.id;
            console.log(params);
            $http.post('/order/createReservation',params,{}).success(function(result) {
                    $scope.showMessage('rcs');
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
                { label : 'Nueva reserva' , action : function(){ redirectToEdit('edit'); } }
                ,{ label : 'Asignar reservas' , action : function(){ redirectToEdit('list'); } }
            ];
            $scope.alertMessage.classType = 'alert-successCustom';
            $scope.alertMessage.title = 'Mensaje de la reserva';
        }
        if( action == 'trcf' ){
            $scope.alertMessage.show = true;
            $scope.alertMessage.message = 'Campos incompletos, revisar el traslado antes de continuar.';
        }
    };
    //abre/cierra datepickers
    $scope.open = function($event,var_open) {
        $event.preventDefault();$event.stopPropagation();
        $scope.open[var_open] = true;
    };
    $scope.formatDate = function(date,format){
        if(date&&format){
            return moment(date).format(format);
        }else{
            return '';
        }
    }
    $scope.getDateHr = function(x,dt){
        var h = x.origin == 'hotel'?true:false;
        var r = x.type == 'round_trip'?true:false;
        if( ( h && r ) || (!h) ){ //arrival date
            var date = x.arrival_date;
            var hr = x.arrival_time;
        }else{ //departure
            var date = x.departure_date;
            var hr = x.departure_time;
        }
        //console.log(date);
        if( dt )
            return moment(date).format('DD/MM/YYYY');//.format('YYYY/MM/DD');// + moment(hr).tz(timeZone).format(' h:mm:ss a');
        else
            return moment(hr).format('h:mm a');// + moment(date).tz(timeZone).format(' YYYY/MM/DD');
    };
    $scope.sortByDateHr = function(x){
        var date = $scope.getDateHr(x,true);
        date = new Date(date);
        return date;
    };
    $scope.getIcon = function(x){
        var today = moment().tz(timeZone);
        var date = moment( $scope.getDateHr(x,true) ).tz(timeZone);
        var result = ''
        if( today.format("YYYY-MM-DD") === date.format("YYYY-MM-DD") )
            result = "fa fa-exclamation-triangle";
        else if( today.add(1,'d').format("YYYY-MM-DD") == date.format("YYYY-MM-DD") )
            result = "fa fa-exclamation";
        return result;
    };
    $scope.openAssign = function(x){
        $scope.modal = x;
        $scope.modal.transfer2 = x.transfer.id || x.transfer;
        $scope.asignando = true;
        $scope.updateOriginsFormat();
        $scope.getTransfers();
        //console.log(x);
        $scope.getVehicles();
        jQuery('#select-transport-update').modal('show');
    };
    $scope.getVehicles = function(){
        $scope.vehicles = [];
        if( $scope.modal.transfer ){
            var params = {
                transfer : $scope.modal.transfer
            };
            $http.post('/TransportAsign/getVehicles',params,{}).success(function(result) {
                console.log(result);
                $scope.vehicles = result;
                $scope.filterV($scope.modal.asign.company);
            });
        }
    };
    $scope.filter_vehicles = {};
    $scope.filterV = function(company){
        $scope.filter_vehicles = $filter('filter')($scope.vehicles, function(val){
            return val && val.company &&(!company || val.company == company);
        });
    };
    var getModalFields = function(){
        var result = {
            id : $scope.modal.id
            //,vehicle : $scope.modal.vehicle.id
            ,hotel : $scope.modal.hotel.id
            ,service_type : $scope.modal.service_type
            ,transfer : $scope.modal.transfer2
            ,pax : $scope.modal.pax
            //,no_show : $scope.modal.no_show
            ,notes : $scope.modal.notes
            //,driver : $scope.modal.driver
            //,notes2 : $scope.modal.notes2
            //,pickup_time : $scope.modal.asign.pickup_time
            ,asign : $scope.modal.asign //lo comentado se pasó a este objeto
        };
        /*if( $scope.dtfa[0] )
            result.vehicle_arrival = $scope.modal.arrivalpickup_time;
        if( $scope.dtfa[1] )
            result.departurepickup_time = $scope.modal.departurepickup_time;*/
        return result;
    }
    $scope.newUpdate = function(){
        if( $scope.modal.asign && ( $scope.modal.asign.vehicle_arrival || $scope.modal.asign.vehicle_departure ) ){
            $http.post('/TransportAsign/assign',getModalFields(),{}).success(function(result) {
                console.log(result);
                if(result){
                    divideAfterUpdate(result);
                    /*result.groupBy = $scope.getDateHr(result,true);
                    if( !$scope.reservations.asigned[result.groupBy] ) $scope.reservations.asigned[result.groupBy] = [];
                    $scope.reservations.asigned[result.groupBy].push(result);
                    for( var x in $scope.reservations.notAsigned[result.groupBy] )
                        if($scope.reservations.notAsigned[x].id == result.id)
                            $scope.reservations.notAsigned.splice(x,1);*/
                    jQuery('#select-transport-update').modal('hide');
                }
            });
        }
    }
    //Filtros, esto tal vez sería mejor meterlo como un servicio
    $scope.filters = {};
    $scope.filtersArray = [
        { label : 'Folio' , value : 'folio' , type : 'number' , field : 'folio' }
        ,{ label : $rootScope.translates.arrival_date , value : 'arrival' , type : 'date' , field : 'arrival_date' , options : { oneDate : false } }
        ,{ label : $rootScope.translates.departure_date , value : 'departure' , type : 'date' , field : 'departure_date' , options : { oneDate : false } }
        ,{ label : $rootScope.translates.reservation_date , value : 'reserve' , type : 'date' , field : 'createdAt' , options : { oneDate : false } }
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
    $scope.filterDate = function(action){
        if( ! $scope.theDate )
            $scope.theDate = moment();
        if( action == 'today' )
            $scope.theDate = moment();
        else if( action == 'prev' )
            $scope.theDate.subtract(1,'days');
        else if( action == 'next' )
            $scope.theDate.add(1,'days');
        var aux = $scope.theDate.clone();
        aux.add('days',1)
        //enviamos el filtro a arrival_date y departure_date
        $scope.filters.arrival_date = { 
            label : $rootScope.translates.arrival_date , 
            value : 'arrival' , type : 'date' , 
            field : 'arrival_date' , 
            options : { oneDate : true } ,
            model : {from:$scope.theDate.format('YYYY/MM/DD'), to:aux.format('YYYY/MM/DD')}
        };
        $scope.filters.departure_date = { 
            label : $rootScope.translates.departure_date , 
            value : 'departure' , type : 'date' , 
            field : 'departure_date' , 
            options : { oneDate : true } ,
            model : {from:$scope.theDate.format('YYYY/MM/DD'), to:aux.format('YYYY/MM/DD')}
        };
        $scope.currentPage = 1;
        sendFilterFx(0);
    }
    $scope.resetFilter = function(){
        $scope.isCollapsedFilter = false;
        $scope.filters = {};
        $scope.currentPage = 1;
        sendFilterFx(0);
    };
    var divideAfterUpdate = function(r){
        if(r){
            r.groupBy = $scope.getDateHr(r,true);
            if( !$scope.reservations.asigned[r.groupBy] ) $scope.reservations.asigned[r.groupBy] = [];
            var index = -1;
            for( var x in $scope.reservations.asigned[r.groupBy] )
                if($scope.reservations.asigned[r.groupBy][x].id == r.id)
                    index = x;
            if( index >= 0 )
                $scope.reservations.asigned[r.groupBy][x] = r;
            else 
                $scope.reservations.asigned[r.groupBy].push(r);
            for( var x in $scope.reservations.notAsigned[r.groupBy] ){
                if($scope.reservations.notAsigned[r.groupBy][x].id == r.id){
                    if(r.type = 'one_way')
                        $scope.reservations.notAsigned[r.groupBy].splice(x,1);
                    else
                        $scope.reservations.notAsigned[r.groupBy][x] =  x;
                }
            }
        }
    }
    var divideReservations = function(r){
        for(var x in r.notAsigned){
            r.notAsigned[x].groupBy = $scope.getDateHr(r.notAsigned[x],true);
        }
        r.notAsigned = _.groupBy(r.notAsigned,'groupBy') || [];
        for(var x in r.asigned){
            r.asigned[x].groupBy = $scope.getDateHr(r.asigned[x],true);
        }
        r.asigned = _.groupBy(r.asigned,'groupBy') || [];
        return r;
    }
    var sendFilterFx = function(skip){
        var fx = {};
        var f = $scope.filters;
        for( var x in f ){
            if( f[x].special_field && f[x].special_field == 'provider' ){
                var t = f[x].model.item.tours;
                f[x].model.item = [];
                for(var y in t) f[x].model.item.push( t[y].id );
            }
            //console.log(f[x]);
        }
        var params = { fields : f , skip : skip };
        console.log(f);
        $http.post('/TransportAsign/getReservations',params,{}).success(function(result) {
            //console.log(result);
            $scope.reservations = divideReservations(result);
            console.log($scope.reservations);
            //$scope.reservations = result;
        });
    };
    $scope.reservations = {};
    $scope.theDate = false;
    $scope.dateRestrinctions : { arrival : { minDate : '', minHr : '' } , departure : { minDate : '', minHr : '' } };
    /*$scope.getReservations = function(){
        var params = {};
        $http.post('/TransportAsign/getReservations',params,{}).success(function(result) {
            console.log(result);
            $scope.reservations = result;
        });
    };*/
    sendFilterFx(0);
    //función set min dates/hrs
    //recibe la fecha para saber si validar la hr
    $scope.setMinDatesHrs = function( date , dh ){
        var result = '';
        var today = moment(); //hoy
        var date = moment(date); //fecha seleccionada
        return result;
    }
});