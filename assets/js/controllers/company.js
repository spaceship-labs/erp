app.controller('companyCTL',function($scope,$http){
    $scope.companies = companies;
    $scope.content = content;
    $scope.currencies = currencies;
    $scope.company = company;

    $scope.getInfo = function(company){
        return {
            "Direccion" : company.address,
            "Apps" : company.apps.join(', '),
            "Moneda base" : company.base_currency.currency_code
        };
    }

    $scope.createCompany = function(newcompany){
        $http({method: 'POST', url: '/company/create',params:newcompany}).success(function (company){
            $scope.companies.push(company);
            jQuery('#companyCreate').modal('hide');
        });    
    };
});


app.controller('companyEditCTL',function($scope){
    $scope.company = company;
    $scope.content = content;
    $scope.allApps = apps;
    $scope.apps = [];

    var updateApps = function(){
        angular.forEach($scope.allApps,function(app){
            if ($scope.company.apps.indexOf(app.name) == -1) {
                $scope.apps.push(app);
            }
        });
    };

    $scope.removeApp = function(app){
        io.socket.post('/company/removeApp',{company:company.id,app:app},function(company){
            $scope.company = company;
            updateApps();
            $scope.$apply();
        });
    };
    $scope.addApp = function(app){
        io.socket.post('/company/addApp',{company:company.id,app:app},function(company){
            $scope.company = company;
            updateApps();
            $scope.$apply();
        });
    };

    $scope.alreadyOnList = function(item) {
        //console.log(item);
        //if ($scope.company.apps.contains(item))
        //    return true;
        return true;
    };

    updateApps();

});



