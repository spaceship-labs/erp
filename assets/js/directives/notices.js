(function () {
    var controller = function($scope,$http,$q){
        var options = {
            'sort':'updatedAt desc',
            'limit':10
        }
        io.socket.get('/notice/find',options,function(data){
            if(!data)
                return;

            $scope.noticesN = data;
            //$scope.$apply();
            $scope.noticeTranslate = {
                update:'actualizó',
                create:'creó',
                destroy:'eliminó'
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
                console.log('object');
                console.log(object);
                for( var m in object.modifications[0] ){
                    var change = object.modifications[0][m];
                    var dt = change.dataType;
                    //console.log(change);
                    if( typeof dt != 'undefined' ){
                        console.log(dt);
                        if( dt.type == 'model' ){
                            requests.push({
                                url : '/'+dt.model+'/find/'+change.before
                                ,action : 'before'
                                ,n : n
                                ,m : m
                            });
                            requests.push({
                                url : '/'+dt.model+'/find/'+change.after
                                ,action : 'after'
                                ,n : n
                                ,m : m
                            });
                        }else if( dt.type == 'collection' ){
                            var aux = '';
                            for(var x = 0;x<change.after.length;x++)
                                aux += (x==0?'':', ') + (change.after[x].name||change.after[x].name_es||'');
                            change.after = aux;
                            var aux = '';
                            for(var x = 0;x<change.before.length;x++)
                                aux += (x==0?'':', ') + (change.before[x].name||change.before[x].name_es||'');
                            change.before = aux;
                        }
                    }
                }
            }
            $q.all(requests.map(function(request) {
                return $http.get(request.url);
            })).then(function(results) {
                console.log('results');
                console.log(results);
                console.log(requests);
                for(var i = 0;i<requests.length;i++){
                    //requests[i].item = results[i].data.name || results[i].data.name_es;
                    $scope.noticesN[requests[i].n].modifications[0][requests[i].m][requests[i].action] = results[i].data.name || results[i].data.name_es;
                }
                //parse results array here ...
                return results;
            });
            /*var result = value;
            var dt = obj.dataType;
            if( typeof dt != 'undefined' ){
                console.log(dt);
                if( dt.type == 'model' ){
                    console.log('http request');
                    console.log(value);
                    $http.get('/'+dt.model+'/find/'+value).then(function(item){
                        item = item.data;
                        console.log( item );
                        console.log( '--------------------------' + (item.name || item.name_es) );
                        result = item.name || item.name_es;
                        return result + 'test-----------';
                    });
                }
            }else{
                return result;
            }*/
        };
        $scope.formatFields();
    };
    controller.$inject = ['$scope','$http','$q'];
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
