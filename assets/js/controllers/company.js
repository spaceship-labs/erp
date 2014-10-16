app.controller('companyEditCTL',function($scope){
    $scope.company = company;
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



app.controller('createCompanyCTL',function($scope){

	jQuery('.companyCreate').ajaxForm(function(data){
		var alt = jQuery('.userAlert p');
		alt.text(data.msg).parent().show();
		jQuery(window).scrollTop(alt.parent().position().top-10);
		update();
	});
	updateNotices($scope,'/home/noticeSuscribeApp',{app:'company'});
	$scope.companies = companies;
	$scope.getInfo = function(company){
		return {
			"Direccion" : company.address,
			"Apps" : company.apps.join(', '),
			"Moneda base" : company.base_currency.currency_code
		};
	}
});