app.controller('companyCTL',function($scope,$http){
    $scope.companies = companies;
    $scope.content = content;
    $scope.currencies = currencies;
    $scope.company = company;
    $scope.user = user;

    $scope.getInfo = function(company){
        return {
            "Direccion" : company.address,
            "Apps" : company.apps.join(', '),
            "Moneda base" : company.base_currency
        };
    };

    $scope.createCompany = function(newcompany){
        newcompany.users = [ user.id ];
        $http({method: 'POST', url: '/company/create',data:newcompany}).success(function (company){
            $scope.companies.push(newcompany);
            //console.log($scope.companies);
            jQuery('#companyCreate').modal('hide');
        });    
    };
});


app.controller('companyEditCTL',function($scope,$http){
    $scope.company = company;
    $scope.content = content;
    $scope.allApps = apps;
    $scope.users = users;
    $scope.missingApps = [];
    $scope.selectedApps = [];
    //$scope.companies = companies;

    var updateApps = function(){
        $scope.missingApps = [];
        $scope.selectedApps = [];
        angular.forEach($scope.allApps,function(app){
            if ($scope.company.apps.indexOf(app.name) == -1) {
                $scope.missingApps.push(app);
            } else {
                $scope.selectedApps.push(app);
            }
        });
    };

    $scope.removeApp = function(app){
        io.socket.post('/company/removeApp',{company:$scope.company.id,app:app.name},function(company){
            $scope.company = company;
            updateApps();
            $scope.$apply();
        });
    };
    $scope.addApp = function(app){
        io.socket.post('/company/addApp',{company:$scope.company.id,app:app.name},function(company){
            $scope.company = company;
            updateApps();
            $scope.$apply();
        });
    };

    updateApps();

    $scope.removeUser = function(user){
        io.socket.post('/company/removeUser',{company:company.id,user:user.id},function(result){
            var indexU = $scope.company.users.indexOf(user);
            $scope.company.users.splice(indexU,1);
            $scope.$apply();
        });
    };
    $scope.addUser = function(user){
        io.socket.post('/company/addUser',{company:$scope.company.id,user:user.id},function(result){
            $scope.company.users.push(user);
            $scope.$apply();
        });
    };

    $scope.filterUsers = function(user) {
        var found = false;
        angular.forEach($scope.company.users,function(suser){
            if (user.id == suser.id) {
                found = true;
            }
        });
        return !found;
    }

});



