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
        $http({method: 'POST', url: '/company/create',params:newcompany}).success(function (company){
            $scope.companies.push(newcompany);
            //console.log($scope.companies);
            jQuery('#companyCreate').modal('hide');
        });    
    };
});


app.controller('companyEditCTL',function($scope){
    $scope.company = company;
    $scope.content = content;
    $scope.allApps = apps;
    $scope.users = users;
    $scope.missingApps = [];
    $scope.usingApps = [];

    var updateApps = function(){
        $scope.missingApps = [];
        $scope.usingApps = [];
        angular.forEach($scope.allApps,function(app){
            if ($scope.company.apps.indexOf(app.name) == -1) {
                $scope.missingApps.push(app);
            } else {
                $scope.usingApps.push(app);
            }
        });
    };

    $scope.removeApp = function(app){
        io.socket.post('/company/removeApp',{company:company.id,app:app.name},function(company){
            $scope.company = company;
            updateApps();
            $scope.$apply();
        });
    };
    $scope.addApp = function(app){
        io.socket.post('/company/addApp',{company:company.id,app:app.name},function(company){
            $scope.company = company;
            updateApps();
            $scope.$apply();
        });
    };

    updateApps();

});



