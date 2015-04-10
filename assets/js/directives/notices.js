(function () {
    var controller = function($scope,$http,$q,$rootScope){
        $scope.translates = $rootScope.translates;
        var options = {
            'sort' : 'updatedAt desc',
            'limit' : 10
        }
        io.socket.get('/notice/find',options,function(data){
            if(!data)
                return;

            $scope.noticesN = data;
            //$scope.$apply();
            $scope.noticeTranslate = {
                update:'actualizó: ',
                create:'creó un elemento',
                destroy:'eliminó: '
            };
            $scope.formatFields();
        });
        io.socket.on('notice',function(data){
            if(data && data.id)
                $http.get('/notice/'+data.id).then(function(notice){
                    if(notice && notice.data)
                        $scope.noticesN.unshift(notice.data)
                });
            $scope.formatFields();
        });
        $scope.fromNow = function(tm){
            return moment(tm).lang('es').fromNow()
        }
        $scope.formatFields = function(){
            var requests = [];
            for( var n in $scope.noticesN ){
                var object = $scope.noticesN[n];
                for( var m in object.modifications[0] ){
                    var change = object.modifications[0][m];
                    var dt = change.dataType;
                    //console.log(change);
                    if( typeof dt != 'undefined' ){
                        //console.log(dt);
                        if( dt.type == 'model' ){
                            if( change.before ){
                                requests.push({
                                    url : '/'+dt.model+'/find/'+change.before
                                    ,action : 'before'
                                    ,n : n
                                    ,m : m
                                });
                            }
                            if( change.after ){
                                requests.push({
                                    url : '/'+dt.model+'/find/'+change.after
                                    ,action : 'after'
                                    ,n : n
                                    ,m : m
                                });
                            }
                        }else if( dt.type == 'collection' ){
                            var aux = '';
                            if (change.after){
                                for(var x = 0;x<change.after.length;x++)
                                    aux += (x==0?'':', ') + (change.after[x].name||change.after[x].name_es||'');
                            }
                            change.after = aux;
                            var aux = '';
                            if (change.before){
                                for(var x = 0;x<change.before.length;x++)
                                    aux += (x==0?'':', ') + (change.before[x].name||change.before[x].name_es||'');
                            }
                            change.before = aux;
                        }
                    }
                }
                if( object.model == 'order' ){
                    requests.push({
                        url : '/'+object.model+'/find/'+object.modifyId
                        ,action : 'reservation'
                        ,n : n
                    });
                }
            }
            $q.all(requests.map(function(request) {
                return $http.get(request.url);
            })).then(function(results) {
                //console.log('results');console.log(results);
                for(var i = 0;i<requests.length;i++){
                    if( requests[i].action == 'reservation' ){
                        $scope.noticesN[requests[i].n].rdata = results[i].data;
                        //console.log(results[i].data);
                    }else{
                        $scope.noticesN[requests[i].n].modifications[0][requests[i].m][requests[i].action] = results[i].data.name || results[i].data.name_es;
                    }
                }
                return results;
            });
        };
        $scope.formatFields();
        $scope.getReservationString = function(notice){
            var results = '';
            if( notice.rdata ){
                var rss = _.groupBy(notice.rdata.reservations,function(res){ return res.reservation_type });
                for(var x in rss){
                    results += ( results==''?'':', ' ) + x;
                }
                results = results!=''? "Reservaciones de " + results:'';
            }
            return results;
        }
    };
    controller.$inject = ['$scope','$http','$q','$rootScope'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                object : '=',
                app : '=',
                apps : '=',
            },
            templateUrl : '/template/find/notices.html'
        };
    };
    app.directive('notices', directive);
}());
