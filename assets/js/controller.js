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

	$scope.sup = function(){
		console.log('sup')
	};
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

app.controller('noticeCTL',function($scope){
	io.socket.on('update',function(data){
		if(data)
			update();
	});

	var $ = jQuery
	, update = function(){
		io.socket.get('/home/noticeSuscribe',function(data){
			console.log(data);
			for(var i in data){
				$scope[i] = data[i];
			}
			$scope.models = {};
			for(var m=0;m<data.modify.length;m++){
				console.log(data.modify[m]);
				$scope.models[data.modify[m].model] = {};
				jQuery.post('/home/noticeModifyInfo',{model:data.modify[m].model,mId:data.modify[m].id},function(d){
					$scope.models[d.model][d.id] = d.info;	
					$scope.$apply();
				});
			}
		});
	
	};
	
	$scope.translate = {
		update:'actualizo'
		,create:'creo'
		,destroy:'elimino'
	}
	update();
});
