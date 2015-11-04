app.controller('transportAsignCTL',function($scope, $http, $rootScope, $compile, uiCalendarConfig, chroma){
    var timeZone = 'America/Mexico_City';
    moment.tz.add(timeZone+'|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

    
    var on = {},
    current_lang = window.current_lang || 'es';
    on.eventClick = function(even, jsEvent, view, revertFunc){
        var start = moment(even.start).tz(timeZone),
            end = moment(even.end).tz(timeZone);
        if(!end.isValid())
            end = start.add(1, 'hour');
        $scope.modal = {
            start: start.toDate(),
            end: end.toDate(),
            company: even.transport.company,
            transport: even.transport.id,
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
        jQuery('#select-transport-update').modal('show');

    };

    on.select = function(start, end){
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
            
        return {
            transport: $scope.modal.transport,
            start: start.toDate().toISOString(),
            end: end.toDate().toISOString()
        };
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
            return {
                asign: asign, 
                transport: asign.transport, 
                title: ' ID: ' + asign.transport.car_id + 
                        ' | Company: ' + getCompanyName(asign.transport.company) + 
                        ' | Placa: ' + asign.transport.license_plate +
                        ' | Max Pax:' + asign.transport.max_pax ,
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

    function getCompanyName(company){
        var found = _.find(all_companies, function(a){
            if(a.id == company) return true;
        })
        return found && found.name || '';
    }

    $scope.eventSources = [$scope.events, $scope.eventsF];

});
