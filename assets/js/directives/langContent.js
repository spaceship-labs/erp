(function () {
	var controller = function($scope){

    };
	controller.$inject = ['$scope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                object : '=',
                fields : '=',
                action : '@',
                formTitle : '@',
                formSave : '&',
        	},
        	templateUrl : '/template/find/langContent.html'
        };
    };
    app.directive('langContent', directive);

}());
