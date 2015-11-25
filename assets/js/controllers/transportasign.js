app.controller('transportAsignCTL',function($scope, $http, $rootScope, $compile, uiCalendarConfig, chroma, $filter){
    var timeZone = 'America/Mexico_City';
    moment.tz.add(timeZone+'|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

    
    var on = {},
    current_lang = window.current_lang || 'es';
    $scope.view_type = window.view_type;

    $scope.location = {};
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

    //}

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
        if($scope.modal.revertFunc){
            $scope.modal.revertFunc();
        }
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
        $scope.modal.pax = $scope.modal.pax || 1;
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
        }
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
});

