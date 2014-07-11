var app = angular.module('spaceerp',['ngSails']);

app.config(['$sailsProvider', function ($sailsProvider) {
    $sailsProvider.url = 'http://localhost:1337';
}]);

app.controller('userCTL',function($scope,$sails){
	$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
	var updateList = function(){
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
	var appsList = []
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
	};
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

});

app.controller('galleryCTL',function($scope){
	jQuery('form.gallery').ajaxForm(function(data){
		if(data && data.img){
			updateContent();
		}else{
			jQuery('.alert p').text(data.text).parent().removeClass('unseen');
		}
	});
	
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

app.controller('salesCTL',function($scope){
    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });
});

app.controller('saleAddCTL',function($scope) {
    $scope.selectedProducts = {};
    $scope.products = [{Id: "1",Name: "Soap", Price: "25",Quantity : 1},
                      {Id:"2",Name: "Shaving cream", Price: "50",Quantity : 1},
                      {Id:"3",Name: "Shampoo", Price: "100",Quantity : 1}];
    $scope.clients = {};

    $scope.update = function () {
        //jQuery.get('/product/productsJson',{}, function (products) {//{selected: $scope.selectedProducts},
            //$scope.products = products;
            //$scope.$apply();
        //});

        jQuery.get('/sale/clientsJson',{}, function (clients) {//{selected: $scope.selectedProducts},
            $scope.clients = clients;
            $scope.$apply();
        });
    };

    $scope.update();

    $scope.addProduct = function (product) {

        $scope.selectedProducts.push(product);

        var index = $scope.products.indexOf(product);
        $scope.products.splice(index, 1);

        $scope.$apply();
    };

    $scope.removeProduct = function (product) {

        $scope.products.push(product);

        var index = $scope.selectedProducts.indexOf(product);
        $scope.selectedProducts.splice(index, 1);

        $scope.$apply();
    };

    $scope.totalPrice = function (){
        var total = 10;
        for (var count = 0; count < $scope.selectedProducts.length; count++) {
            total += $scope.selectedProducts[count].Price * $scope.selectedProducts[count].Quantity;
        }
        return total;
    };

    $scope.partialPrice = function (price,quantity) {
        return price*quantity;
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
