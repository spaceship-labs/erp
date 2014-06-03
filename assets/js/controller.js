var app = angular.module('spaceerp',['ngSails']);

app.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://localhost:1337';
}]);

app.controller('userCTL',function($scope,$sails){
	$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
	var updateList = function(){
		jQuery.get('/users/all',function(data){
			console.log(data);
			$scope.users = data;
			$scope.$apply();
		});
		jQuery.get('/users/indexJson',function(data){
			console.log(data);
			$scope.alphabets_company = data;
			$scope.$apply();
		});
		
	}
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

	updateNotices($scope,'/home/noticeSuscribeApp',{app:'users'},function(){
		updateList();	
	});

	$scope.selectLetter = function(l){
		if(l)
			$scope.searchInputSelect = l;
	}
	updateList();
});

app.controller('userEditCTL',function($scope){
	updateNotices($scope,'/home/noticeSuscribeSingle',{modify:jQuery('input[name="userId"]').val()});
});

app.controller('createCompanyCTL',function($scope){
	var update = function(){
		jQuery.get('/admin/indexJson',function(data){
			if(data){
				$scope.companyDash = data;
				$scope.$apply();
			}
		});
	};
	update();
	jQuery('.companyCreate').ajaxForm(function(data){
		var alt = jQuery('.userAlert p');
		alt.text(data.msg).parent().show();
		jQuery(window).scrollTop(alt.parent().position().top-10);
		update();
	});
	updateNotices($scope,'/home/noticeSuscribeApp',{app:'admin'});
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
	updateNotices($scope,'/home/noticeSuscribeAll');
});

function updateNotices($scope,url,dt,cb){
	io.socket.on('update',function(data){
		if(data){
			updateNotices($scope,url,dt);
			return cb && cb();
		}
	});
	io.socket.get(url,dt,function(data){
		if(data && data.noticesN){
			for(var i in data){
				$scope[i] = data[i];
			}
			$scope.models = {};
			for(var m=0;m<data.modifyN.length;m++){
				$scope.models[data.modifyN[m].model] = {};
				jQuery.post('/home/noticeModifyInfo',{model:data.modifyN[m].model,mId:data.modifyN[m].id},function(d){
					$scope.models[d.modelN][d.id] = d.info;	
					$scope.$apply();
				});
			}
		}
	});
	$scope.translate = {
		update:'actualizo'
		,create:'creo'
		,destroy:'elimino'
	}

}
