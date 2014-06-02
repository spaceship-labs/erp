var app = angular.module('spaceerp',['ngSails']);

app.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://localhost:1337';
}]);

app.controller('userCTL',function($scope,$sails){
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

app.controller('currencyCTL',function($scope){
	var $ = jQuery
	, updateContent = function(){
		$.get('/admin/currenciesJson',function(data){
			for(var i in data){
				$scope[i] = data[i];
			}
			$scope.$apply();
			$('form').ajaxForm(function(data){
				updateContent();
				var alt = $('.userAlert p');
				alt.text(data.msg).parent().show();
				$(window).scrollTop(alt.parent().position().top-10);
			});
			


		});
		$.get('/admin/chartsData',function(data){
			$scope.charts = data;
			$scope.$apply();
			if(data.length)
				exchange_rates();
		});
	};

	$('.removeCurrency').on("click","a",function(e){
		e.preventDefault();
		
		$.post('/admin/editAjax',{
			method:"removeCurrency"
			,currency:$(this).attr('href')
			,userId:true
		}
		, updateContent
		);
	});
	updateContent();
});
