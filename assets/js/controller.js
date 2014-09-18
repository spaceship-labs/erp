var app = angular.module('spaceerp',['ui.bootstrap','ngTagsInput','angularFileUpload']);
/*app.factory('socket',['$sailsSocket', function($sailsSocket){
    return $sailsSocket()
}])*/
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

app.controller('companyEditCTL',function($scope){
    $scope.company = company;
    $scope.apps = apps;
    $scope.removeApp = function(app){
        io.socket.post('/company/removeApp',{company:company.id,app:app},function(company){
            $scope.company = company;
            $scope.$apply();
        });
    };
    $scope.addApp = function(app){
        io.socket.post('/company/addApp',{company:company.id,app:app},function(company){
            $scope.company = company;
            $scope.$apply();
        });
    };

});

app.controller('userCTL',function($scope){
	$scope.alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
	$scope.users = users;
	$scope.alphabets_company = alphabet;
	$scope.searchInputSelect = alphabet[0];
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

app.controller('fieldCTL',function($scope,$http){
	$scope.product = product;//TODO reemplazar por product_type , tambien hay que actualizar la view
    $scope.new_field = { product_type : $scope.product.id };
    $scope.field_types = types;

	$scope.removeField = function(index){
        var data = $scope.product.fields[index];
        $http.post('/product_type/removeField',data,{}).success(function(res){
            $scope.product.fields.splice(index,1);
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            }
        });
	};

    $scope.processForm = function() {
        $http.post('/product_type/createField',$scope.new_field,{}).success(function(data) {
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
                $scope.product.fields.push(data.field);
                $scope.new_field.handle = "";
                $scope.new_field.name = "";
            } else {
                jQuery('.alert p').text('error').parent().removeClass('unseen');
            }
        });
    }
});

app.controller('productCTL',function($scope,$http){

    var initialize = function() {
        $scope.product = typeof window.product != 'undefined' ? window.product : {};
        $scope.product_type = typeof window.product_type != 'undefined' ? window.product_type : {};
        var tmp = {};
        for(var i=0;i<window.product_types.length;i++){
            tmp[window.product_types[i].id] = window.product_types[i].name;
        }
        $scope.product_types = tmp;

        if ($scope.product_type.fields) {
            $scope.aux_fields = [];
            for (var i = 0; i < $scope.product_type.fields.length; i++) {
                var foundOne = false;
                for (var j = 0; j < $scope.product.fields.length; j++) {
                    if ($scope.product.fields[j].field == $scope.product_type.fields[i].id) {
                        var field = $scope.product.fields[j];
                        field.name = $scope.product_type.fields[i].name;
                        field.type = $scope.product_type.fields[i].type;
                        field.values = $scope.product_type.fields[i].values;
                        $scope.aux_fields.push(field);
                        foundOne = true;
                    }
                }
                if (!foundOne) {
                    var field = { id : 0,field: $scope.product_type.fields[i].id, product: $scope.product.id, value: "", type: $scope.product_type.fields[i].type, name: $scope.product_type.fields[i].name, values: $scope.product_type.fields[i].values };
                    $scope.aux_fields.push(field);
                }
            }
        }

        if (!$scope.product.price) {
            $scope.product.price = { cost : 0,margin : 0,id : 0 };
        }

        if (!$scope.product.quantity) {
            $scope.product.quantity = 0;
        }

        $scope.product.addInventory = 0;
    };

    $scope.processInventory = function() {
        $http.post('/product/updateInventory',{inventory : $scope.product.addInventory,product : $scope.product.id },{}).success(function(data){
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
                $scope.product.quantity = parseInt($scope.product.quantity) + parseInt($scope.product.addInventory);
                $scope.product.addInventory = 0;
            }
        });
    };

    $scope.processPricing = function() {
        $http.post('/product/updatePrices',{price : $scope.product.price,product : $scope.product.id },{}).success(function(data){
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            }
        });
    };

    $scope.processProductTypeFields = function() {
        $http.post('/product/updateFields',{fields : $scope.aux_fields,product : $scope.product.id },{}).success(function(data){
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            }
        });
    };

    $scope.calculatePrice = function(){
        if ($scope.product.price.cost) {
            return $scope.product.price.cost * (1 + ($scope.product.price.margin/100));
        }
        return 0;
    };

    $scope.calculateTotalInventory = function(){
        return parseInt($scope.product.quantity) + parseInt($scope.product.addInventory);
    };

    initialize();
});

app.controller('productsCTL',function($scope){
    $scope.products = typeof products != 'undefined' ? products : {};
});

app.controller('galleryCTL',function($scope){
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

app.controller('saleCTL',function($scope,$http){
    function showResponse(data) {
        if(data){
            location.reload();
        }
    };

    $scope.deleteProduct = function(product,quote){
        var data = {
            product : product,
            quote : quote
        };
        $http.post('/salesQuote/removeProduct',data,{}).success(showResponse);
    }
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
    $scope.product_types = product_types;
    $scope.machine.product_types = machine_product_types;//TODO WTF con esto , cuando se serializa machine no trae el arreglo y tengo que serializarlo aparte

    console.log(machine);

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
	$scope.products = window.products;
    $scope.product_types = window.product_types;

    $scope.product = {};
    $scope.machine = {};

	$scope.processSelectedProduct = function(quoteID){
        var product = {
            price : $scope.calculateProductPrice() ,
            priceTotal :  $scope.calculateProductPriceTotal(),
            product : $scope.product.id,
            quantity : $scope.product.quantity,
            saleQuote : quoteID,
            name : $scope.product.name
        };

        if ($scope.machine) {
            product.machine = $scope.machine;
        }

		$http.post('/salesQuote/addProduct',{product : product}).then(function(r){
			if(r)
				location.reload();
		});
	};

    $scope.checkMachines = function(){
        for (var i=0;i<$scope.product_types.length;i++) {
            if ($scope.product_types[i].id == $scope.product.product_type.id) {
                $scope.product.machines = $scope.product_types[i].machines;
                return true;
            }
        }
        return false;
    };

    $scope.calculateProductPrice = function(){
        if ($scope.product.machines && $scope.machine.id) {
            return ($scope.product.price.cost * (1 + ($scope.product.price.margin/100))) + ($scope.machine.ink_cost * (1 + ($scope.machine.ink_utility/100)));
        } else {
            return $scope.product.price.cost * (1 + ($scope.product.price.margin/100));
        }
    };

    $scope.calculateProductPriceTotal = function(){
        return $scope.calculateProductPrice() * $scope.product.quantity;
    };
});

app.controller('productTypeCTL',function($scope,$http){
    $scope.product_types = window.product_types;
    $scope.product_type = {};

    var tmp = {};
    for(var i=0;i<window.sales_type.length;i++){
        tmp[window.sales_type[i].type] = window.sales_type[i].name;
    }
    $scope.sales_type = tmp;

    var tmp = {};
    for(var i=0;i<window.inventory_type.length;i++){
        tmp[window.inventory_type[i].type] = window.inventory_type[i].name;
    }
    $scope.inventory_types = tmp;

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
            $scope.product_types.push(data);
            $scope.product_type.inventory_use = false;
            console.log($scope.product_type);
        }
    };

    $scope.processForm = function(){
        $http.post('/product_type/create',$scope.product_type, {}).success(showResponse);
    };

});

app.controller('editProductTypeCTL',function($scope,$http){
    $scope.product_types = window.product_types;
    $scope.product_type =  window.product;
    console.log($scope.product_type);

    var tmp = {};
    for(var i=0;i<window.sales_type.length;i++){
        tmp[window.sales_type[i].type] = window.sales_type[i].name;
    }
    $scope.sales_type = tmp;

    var tmp = {};
    for(var i=0;i<window.inventory_type.length;i++){
        tmp[window.inventory_type[i].type] = window.inventory_type[i].name;
    }
    $scope.inventory_types = tmp;

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.processForm = function(){
        $http.post('/product_type/update',$scope.product_type, {}).success(showResponse);
    };

});

app.controller('installationAddCTL',function($scope){
    $scope.products = window.products;

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
