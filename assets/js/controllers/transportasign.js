app.constant('uiCalendarConfig', {calendars: {}})
.controller('transportAsignCTL',function($scope, $http, $rootScope, $compile, uiCalendarConfig, chroma){
    
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };

    /* alert on eventClick */
    var on = {};

    on.eventClick = function(even, jsEvent, view){
        $scope.modal = {
            start: even.start,
            end: even.end,
            company: even.transport.company,
            transport: even.transport.id,
            asign: even.asign,
            event: even
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

    on.drop = function(){
    	console.log('YO!!!', arguments);
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

    var cacheTransports = {};
    $scope.changeCompany = function(){
        var company = $scope.modal.company;
        if(!cacheTransports[company]){
            $http.get('/transport/find?company='+company).then(function(res){
                $scope.transports = cacheTransports[company] = res.data || [];
            });
        }else{
            $scope.transports = cacheTransports[company]; 
        }
    };

    $scope.save = function(){
        $http.post('/transportAsign/create', {
            transport: $scope.modal.transport,
            start: $scope.modal.start,
            end: $scope.modal.end
        }).then(function(res){
            if(res && res.data)
                addEvent(res.data);
        });

    };

    $scope.update = function(){
        $http.post('/transportAsign/'+$scope.modal.asign.id, {
            start: $scope.modal.start,
            end: $scope.modal.end,
            company: $scope.modal.company,
            transport:  $scope.modal.transport
        }).then(function(res){
            console.log(res);
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

    function onSelect(start, end){
    	var time = moment(start);
        $scope.modal = {};
        $scope.modal.day = time.format('YYYY/MM/DD');
        $scope.modal.start = start;
        $scope.modal.end = time.add(1, 'hour').toDate();
        console.log($scope.modal);
        jQuery('#select-transport').modal('show');
        getCompanies();
    }

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 600,
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
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        select: onSelect,
        allDaySlot: false,
        slotEventOverlap: false,
      }
    };


    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, /*timezone*/ done) {
        $http.get('/transportAsign/find?sort=start DESC').then(function(res){
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
            return {asign: asign, transport: asign.transport, title: 'ID: ' + asign.transport.car_id + ' | Company: '+ getCompanyName(asign.transport.company), start: asign.start, end: asign.end, allDay: false, backgroundColor: bg, textColor: color, borderColor: 'black', className: 'even_hour'}
        });
    }

    function getCompanyName(company){
        return _.find(all_companies, function(a){
            if(a.id == company) return true;
        }).name;
    }

    $scope.eventSources = [$scope.events, $scope.eventsF];

});
