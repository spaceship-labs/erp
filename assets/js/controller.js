var app = angular.module('spaceerp',['ngSails']);

app.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://localhost:1337';
}]);

app.controller('userShowAllCTL',function($scope,$sails){
	jQuery.get('/users/all',function(data){
		$scope.users = data;
		$scope.$apply()
	});

	$scope.userFilter = function(u){
		var prefix = '^';
		if($scope.searchInputSelect && !$scope.searchInput){
			prefix += $scope.searchInputSelect;
		}else{
			prefix += $scope.searchInput;
		}

		var reg = new RegExp(prefix,'i');
		return u && u.name.match(reg);

	}
});

app.controller('userEditCTL',function($scope){
	$scope.updateTags = function(){
	
	}
});
