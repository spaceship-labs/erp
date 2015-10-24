app.constant('uiCalendarConfig', {calendars: {}})
.controller('transportAsignCTL',function($scope, $http, $rootScope, $compile, uiCalendarConfig){
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };

    /* alert on eventClick */
    $scope.alertOnEventClick = function(even, jsEvent, view){
        console.log(even);
        console.log("click!");
	    $scope.modal = {
            start: even.start,
            end: even.end,
            company: even.transport.company,
            transport: even.transport.id
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
        console.log($scope.modal.company);
        var company = $scope.modal.company;
        if(!cacheTransports[company]){
            $http.get('/transport/find?company='+company).then(function(res){
                $scope.transports = cacheTransports[company] = res.data || [];

                console.log($scope.transports);
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
            console.log(res);
            if(res && res.data)
                addEvent(res.data);
        });

    };

    $scope.update = function(){
        console.log($scope.modal);
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
        //$scope.events.push({title: 'Feed Me 2' + m,start: start, end: end,allDay: false, className: ['customFeed']})
        $scope.modal = {};
        $scope.modal.day = moment(start).format('YYYY/MM/DD');
        $scope.modal.start = start;
        $scope.modal.end = end;
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
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        select: onSelect 
      }
    };

    /* event source that contains custom events on the scope */
    /*
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    */

    /* event source that pulls from google.com */
    /*$scope.eventSource = {
            //url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            url: "/transportAsign/test",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Mexico_City' // an option!
    };
    */

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, /*timezone*/ done) {
      $http.get('/transportAsign/find').then(function(res){
      	if(res && res.data){
            var ls = formatEven(res.data);
            done(ls);
        }
      });
    };

    function formatEven(transportAsigns, done){
        console.log(transportAsigns);
        var list = transportAsigns.length && transportAsigns || [transportAsigns];
        return list.map(function(asign){
            return {asign: asign, transport: asign.transport, title: 'ID: ' + asign.transport.car_id + ' | Company: '+ getCompanyName(asign.transport.company), start: asign.start, end: asign.end, allDay: false}
        });
    }

    function getCompanyName(company){
        return _.find(all_companies, function(a){
            if(a.id == company) return true;
        }).name;
    }

    $scope.eventSources = [$scope.events, $scope.eventsF];

});
