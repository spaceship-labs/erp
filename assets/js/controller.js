var app = angular.module('spaceerp',['ngSails','ui.bootstrap']);

app.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://localhost:1337';
}]);

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
	updateContent();
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
	$scope.product = product;

	$scope.product_types = {
		stockable : 'Producto Inventariado',
		consumable : 'Consumible',
		service : 'Servicio',
	}		

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

app.controller('saleAddCTL',function($scope) {
    $scope.selectedProducts = [];
    $scope.products = [];
    $scope.clients = [];

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    var options = {
        success : showResponse,
        data : { products : $scope.selectedProducts }
    };

    jQuery('form').ajaxForm(options);

    $scope.update = function () {
        jQuery.get('/product/productsJson',{}, function (products) {//{selected: $scope.selectedProducts},
            $scope.products = products;
            $scope.$apply();
            var select = jQuery("#products");
            updateChosen(select);
        });

        jQuery.get('/sale/clientsJson',{}, function (clients) {//{selected: $scope.selectedProducts},
            $scope.clients = clients;
            $scope.$apply();
            var select = jQuery("#client");
            updateChosen(select);
        });

    };

    $scope.update();

    $scope.addProduct = function () {

        var index = jQuery("#products").val();

        var product = $scope.products[index];
        product.Quantity = 1;

        if (!product.price) {
            product.price = 10;
        }

        $scope.products.splice(index, 1);

        $scope.selectedProducts.push(product);

        window.setTimeout(updateChosen,100);
    };

    $scope.removeProduct = function (index) {

        var product = $scope.selectedProducts[index];

        $scope.selectedProducts.splice(index, 1);

        $scope.products.push(product);

        window.setTimeout(updateChosen,100);

    };

    $scope.totalPrice = function (){
        var total = 0;

        for (var i = 0;i < $scope.selectedProducts.length;i++) {
            total += $scope.selectedProducts[i].price * $scope.selectedProducts[i].Quantity;
        }
        return total;
    };

    $scope.partialTotal = function(index){
        return $scope.selectedProducts[index].Quantity * $scope.selectedProducts[index].price;
    };
});

app.controller('saleEditCTL',function($scope){
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
