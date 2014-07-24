var app = angular.module('spaceerp',['ngSails','ui.bootstrap']);

app.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://localhost:1337';
}]);

app.directive('chosen',function(){
   var linker = function(scope,element,attrs){
       var list = attrs['chosen'];
        scope.$watch(list,function(){
            element.trigger('liszt:updated');
            element.trigger('chosen:updated');
        });
        element.chosen();
   };

   return {
       restrict : 'A',
       link : linker
   }
});

app.controller('userCTL',function($scope,$sails){
	$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
	$scope.users = users;
	$scope.alphabets_company = alphabet;
	$scope.searchInputSelect = alphabet[0];
	/*var updateList = function(){
		jQuery.get('/users/all',function(data){
			$scope.users = data;
			$scope.$apply();
			if(data)
				$scope.searchInputSelect = 'a';
				//$scope.searchInputSelect = data[0].name[0];
		});
		jQuery.get('/users/indexJson',function(data){
			$scope.alphabets_company = data;
			$scope.$apply();
		});
		
	}*/
	$scope.userFilter = function(u){		
		if($scope.searchInputSelect && !$scope.searchInput){
			//return true;
			return $scope.searchInputSelect == u.last_name[0].toUpperCase();
		}else{
			var regex = new RegExp('^'+$scope.searchInput,'i');
			var name = u.name+' '+u.last_name;
			return name.match(reg);
		}
	}
	
	updateNotices($scope,'/home/noticeSuscribeApp',{app:'users'},function(){
		//updateList();	
	});

	$scope.selectLetter = function(l){
		if(l)
			$scope.searchInputSelect = l;
	}
});

app.controller('userEditCTL',function($scope){
	$scope.user = user;

	/*var appsList = []
	, updateContent = function(){
		jQuery.get('/users/editJson/'+jQuery('input[name="userId"]').val(),function(data){
			for(var i in data){
				$scope[i] = data[i];
			}
			$scope.$apply();
			nameApps(data.user.apps);
			updateChosen();
		});
	};

	updateContent();
	updateNotices($scope,'/home/noticeSuscribeSingle',{modify:jQuery('input[name="userId"]').val()});
	$scope.addApp = function(){
		if($scope.selectApp){
			var apps = appsList;
			apps.push($scope.selectApp);
			var data = {
				method:'apps'
				,apps:apps
				,userId:jQuery('input[name="userId"]').val()
			};
			
			jQuery.post(jQuery('.profileEdit #addApps input[name="url"]').val()+'editAjax',data,function(d){
				updateContent();
			});
			
		}
	};

	$scope.removeApp = function(remove){
		appsList.splice(appsList.indexOf(remove),1);
		var data = {
			method:'apps'
			,apps:appsList
			,userId:jQuery('input[name="userId"]').val()
		};
		jQuery.post(jQuery('.profileEdit #addApps input[name="url"]').val()+'editAjax',data,function(d){
			updateContent();
		});
	};

	var nameApps = function(dataApps){
		appsList = [];
		for(var i=0;i<dataApps.length;i++){
			appsList.push(dataApps[i].ctl);
		}
	};*/
});

app.controller('createCompanyCTL',function($scope){
	/*
	var update = function(){
		jQuery.get('/company/indexJson',function(data){
			if(data){
				$scope.companyDash = data;
				$scope.$apply();
			}
		});
	};
	//update();
	*/
	jQuery('.companyCreate').ajaxForm(function(data){
		var alt = jQuery('.userAlert p');
		alt.text(data.msg).parent().show();
		jQuery(window).scrollTop(alt.parent().position().top-10);
		update();
	});
	updateNotices($scope,'/home/noticeSuscribeApp',{app:'company'});
	$scope.companyDash = companyDash;
});

app.controller('currencyCTL',function($scope){
	for(var i=0;i<preload.length;i++){
		$scope[preload[i]] = window[preload[i]];
	}
	
	charts_currencies($scope);

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
		charts_currencies($scope);
		
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
	//updateContent();
});

app.controller('noticeCTL',function($scope){
	updateNotices($scope,'/home/noticeSuscribeAll');
	charts_currencies($scope);
});

app.controller('addProductCTL',function($scope){
	jQuery('form').ajaxForm(function(data){
		if(data){
			updateContent();
			jQuery('.alert p').text(data.text).parent().removeClass('unseen');
			if(data.url)
				window.location.href = data.url;
		}
	});

	var updateContent = function(){
		jQuery.get('/product/editCategoryJson',{catID:jQuery('input[name="catID"]').val()},function(data){
			$scope.fields = data;
			$scope.$apply();
		});
	};

	$scope.removeField = function(e,id){
		e.preventDefault();
		if(id){
			jQuery.get('/product/removeField',{fieldID:id},function(data){
				updateContent();
			});			
		}
		return false;
	};
	updateContent();
});

app.controller('productCTL',function($scope){
	$scope.product = typeof product != 'undefined' ? product : {};

	$scope.product_types = {
		stockable : 'Producto Inventariado',
		consumable : 'Consumible',
		service : 'Servicio',
	}		

});

app.controller('productsCTL',function($scope){
	$scope.products = products;
});

app.controller('galleryCTL',function($scope){
	/*jQuery('form.gallery').ajaxForm(function(data){
		if(data && data.img){
			updateContent();
		}else{
			jQuery('.alert p').text(data.text).parent().removeClass('unseen');
		}
	});*/
	
	var updateContent = function(){
		jQuery.get('/product/productGalleryJson',{id:jQuery('input[name="productID"]').val()},function(data){
			if(data){
				$scope.imgs = data;
				$scope.$apply();
			}
		});
	};
	updateContent();
});

app.controller('saleCTL',function($scope){
    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });
});

app.controller('saleAddCTL',function($scope,$http) {
    $scope.selectedProducts = [];
    $scope.products = [];
    $scope.clients = [];
    $scope.client = { id : 0};

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.initialize = function () {
        $http.get('/product/productsJson').then(function (response) {
            $scope.products = response.data;
        });

        $http.get('/sale/clientsJson').then(function (response) {
            $scope.clients = response.data;
        });

    };

    $scope.initialize();

    $scope.totalPrice = function (){
        var total = 0;

        for (var i = 0;i < $scope.selectedProducts.length;i++) {
            total += $scope.selectedProducts[i].price * $scope.selectedProducts[i].quantity;
        }
        return total;
    };

    $scope.partialTotal = function(index){
        return $scope.selectedProducts[index].quantity * $scope.selectedProducts[index].price;
    };

    $scope.processForm = function(){
        console.log("--> Submitting form");
        var dataObject = {
            products : $scope.selectedProducts,
            client : $scope.client.id
        };
        $http.post('/ventas/crear',dataObject, {}).success(showResponse);
    };
});

app.controller('saleEditCTL',function($scope,$http){


    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });

    $scope.initialize = function () {
        $http.get('/product/productJsonOptional').then(function (products) {//{selected: $scope.selectedProducts},
            $scope.products = products;
            var select = jQuery("#products");
            updateChosen(select);
        });

        $http.get('/sale/clientsJson').then(function (clients) {//{selected: $scope.selectedProducts},
            $scope.clients = clients;
            var select = jQuery("#client");
            updateChosen(select);
        });

    };

    $scope.initialize();
});

app.controller('clientCTL',function($scope){
    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });
});

app.controller('clientAddCTL',function($scope){
    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });
});

app.controller('clientEditCTL',function($scope){
    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });
});

function updateNotices($scope,url,dt,cb){
	io.socket.on('update',function(data){
		if(data){
			updateNotices($scope,url,dt);
			return cb && cb();
		}
	});
	io.socket.get(url,dt,function(data){
		console.log(data);
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

function charts_currencies($scope){
	jQuery.get('/admin/chartsData',function(data){
		$scope.charts = data;
		$scope.$apply();
		if(data.length)
			exchange_rates();
	});
}
