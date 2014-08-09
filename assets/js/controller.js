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
	var id = user.id;
	$scope.updateAccestList = function(){
		io.socket.get('/user/editAjax/',{
			method:'accessList'
			,userId:id
			,accessList:$scope.user.accessList
		},function(data){
			var alt = jQuery('.alert p');
			alt.text(data.msg).parent().show();
		});
	}
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

app.controller('addProductCTL',function($scope,$http){

	$scope.product = product;
});

app.controller('fieldCTL',function($scope,$http){
	$scope.product = product;
	$scope.removeField = function(e,name){
		e.preventDefault();
		var data = {name:name,product_type:e.currentTarget.dataset.product};
		if(product.product_type){
			data.productSingle = 1;
		}
		if(name){
			$http.post('/product_type/removeField',data).then(function(res){
				$scope.product.fields = res.data.fields;
				console.log(res.data.fields);
			});			
		}
		return false;
	};
});

app.controller('productCTL',function($scope){
	$scope.product = typeof product != 'undefined' ? product : {};
	var tmp = {};
	for(var i=0;i<product_types.length;i++){
		tmp[product_types[i].id] = product_types[i].name;
	}
	$scope.product_types = tmp;

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

app.controller('saleCTL',function(){
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
    $scope.total = 0;

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

        $http.get('/client/clientsJson').then(function (response) {
            $scope.clients = response.data;
        });

    };

    $scope.initialize();

    $scope.processForm = function(){
        var dataObject = {
            products : $scope.selectedProducts,
            client : $scope.client.id
        };
        $http.post('/ventas/crear',dataObject, {}).success(showResponse);
    };

    $scope.totalPrice = function (){
        $scope.total = 0;

        for (var i = 0;i < $scope.selectedProducts.length;i++) {
            $scope.total += $scope.selectedProducts[i].price * $scope.selectedProducts[i].quantity;
        }
        return $scope.total;
    };
});

app.controller('saleEditCTL',function($scope,$http){

});

app.controller('saleUpdateClientCTL',function($scope,$http){

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

app.controller('machineCTL',function($scope,$http){
    $scope.machine = machine;
    $scope.machines = machines;
    $scope.machine_modes = [];
    $scope.selectedIndex = null;

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.addMachineMode = function () {
        $scope.machine_modes.push({
            id : 0,
            name : '',
            velocity : '',
            costPerHour : ''
        });
    };

    $scope.deleteMachineMode = function(index){
        $scope.machine_modes.splice(index,1);
    };

    $scope.processForm = function(){
        var dataObject = {
            machine : $scope.machine,
            modes : $scope.machine_modes
        };
        $http.post('/machine/create',dataObject, {}).success(showResponse);
    };
});

app.controller('editMachineCTL',function($scope,$http){
    $scope.machine = machine;
    $scope.machine_modes = machine_modes;
    $scope.selectedIndex = null;

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.addMachineMode = function () {
        $scope.machine_modes.push({
            id : 0,
            name : '',
            velocity : '',
            costPerHour : ''
        });
    };

    $scope.deleteMachineMode = function(index){
        $scope.machine_modes.splice(index,1);//post ?
    };

    $scope.processMachineForm = function(){
        $http.post('/machine/update',{ machine : $scope.machine }, {}).success(showResponse);
    };

    $scope.processMachineModeForm = function(){
        $http.post('/machine/update_modes',{ machine : $scope.machine.id,modes : $scope.machine_modes}, {}).success(showResponse);
    };
});

app.controller('productAddCTL',function($scope,$http){
	for(var i=0;i<products.length;i++){
		console.log(products[i].id);
		console.log(productsId[products[i].id]);
		var count;
		if((count = productsId[products[i].id])){
			products[i].select = true;
		}else{
			products[i].select = false;
		}
		products[i].count = count?count:0;
	}
	$scope.products = window.products;

	$scope.selected = function(quoteID){
		$http.post('/salesQuote/addProduct',{
			quote:quoteID
			,products:$scope.products
		}).then(function(r){
			if(r)
				location.reload();
		});
	};

	$scope.selectCount = function(product){
		if(product.select)
			product.count = 1;
		else 
			product.count = 0;
	};
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

function charts_currencies($scope){
	jQuery.get('/admin/chartsData',function(data){
		$scope.charts = data;
		$scope.$apply();
		if(data.length)
			exchange_rates();
	});
}
