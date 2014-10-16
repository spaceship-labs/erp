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
       scope.$watch(attrs['ngModel'],function(){
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
	$scope.product = product;//TODO reemplazar nombre por product_type , tambien hay que actualizar la view
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

    $scope.createProduct = function(){
        $http.post('/product/create',$scope.product,{}).success(function(data){
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
                $scope.product.quantity = parseInt($scope.product.quantity) + parseInt($scope.product.addInventory);
                $scope.product.addInventory = 0;
            }
        });
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
        $http.post('/SalesQuote/add',dataObject, {}).success(showResponse);
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
    //$scope.machine = {};

	$scope.processSelectedProduct = function(quoteID){
        var product = {
            price : $scope.calculateProductPrice() ,
            priceTotal :  $scope.calculateProductPriceTotal(),
            product : $scope.product.id,
            quantity : $scope.product.quantity,
            saleQuote : quoteID,
            name : $scope.product.name
        };

        if ($scope.selected_machine) {
            product.machine = $scope.selected_machine;
        }

		$http.post('/salesQuote/addProduct',{product : product}).then(function(r){
			if(r)
				location.reload();
		});
	};

    $scope.checkMachines = function(){
        if ($scope.product.machines && $scope.product.machines.length > 0) {
            return true;
        }
        return false;
    };

    $scope.loadMachines = function(){
        for (var i=0;i<$scope.product_types.length;i++) {
            if ($scope.product_types[i].id == $scope.product.product_type.id) {
                if ($scope.product_types[i].machines && $scope.product_types[i].machines.length > 0) {
                    $scope.product.machines = $scope.product_types[i].machines;
                }
            }
        }
    };

    $scope.calculateProductPrice = function(){
        console.log($scope.selected_machine);
        if ($scope.product.machines && $scope.product.machines.length > 0 && $scope.selected_machine) {
            console.log("check it dude");
            return ($scope.product.price.cost * (1 + ($scope.product.price.margin/100))) + ($scope.selected_machine.ink_cost * (1 + ($scope.selected_machine.ink_utility/100)));
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

app.controller('installationConfigCTL',function($scope,$http){
    $scope.cranes = window.cranes;
    $scope.materials = window.materials;
    $scope.tools = window.tools;
    $scope.work_types = window.work_types;
    $scope.zones = window.zones;
    $scope.products = window.products;
    $scope.hours = window.hours;

    for (var i=0;i<$scope.products.length;i++) {
        for (var ti=0;ti<$scope.tools.length;ti++) {
            if ($scope.products[i].id == $scope.tools[ti].product.id) {
                $scope.tools[ti].product = $scope.products[i];
                //$scope.products.splice(i,1);
            }
        }
        for (var mi=0;mi<$scope.materials.length;mi++) {
            if ($scope.products[i].id == $scope.materials[mi].product.id) {
                $scope.materials[mi].product = $scope.products[i];
                //$scope.products.splice(i,1);
            }
        }
    }

    function showResponse(data){
        console.log(data);
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    //cranes
    $scope.processCranes = function() {
        console.log($scope.cranes);
        $http.post('/installation/update_cranes',{ cranes : $scope.cranes}, {}).success(showResponse);
    };
    $scope.addCrane = function() {
        $scope.cranes.push({
            name : '',
            price : 0.0
        });
    };
    $scope.deleteCrane = function(index) {
        $scope.cranes.splice(index,1);
    };

    //materials
    $scope.processMaterials = function() {
        $http.post('/installation/update_materials',{ materials : $scope.materials}, {}).success(showResponse);
    };
    $scope.addMaterial = function() {
        if ($scope.selected_material && $scope.selected_material.id) {
            $scope.materials.push({product : $scope.selected_material });
            var index = $scope.products.indexOf($scope.selected_material);
            $scope.products.splice(index,1);
            $scope.selected_material = {};

        } else {
            console.log("producto error");
        }
    };
    $scope.deleteMaterial = function(index) {
        $scope.products.push($scope.materials[index].product);
        $scope.materials.splice(index,1);
    };

    //tools
    $scope.processTools = function() {
        $http.post('/installation/update_tools',{ tools : $scope.tools}, {}).success(showResponse);
    };
    $scope.addTool = function() {
        if ($scope.selected_tool && $scope.selected_tool.id) {
            $scope.tools.push({product :$scope.selected_tool });
            var index = $scope.products.indexOf($scope.selected_tool);
            $scope.products.splice(index,1);
            $scope.selected_tool = {};
        } else {
            console.log("producto error");
        }

    };
    $scope.deleteTool = function(index) {
        $scope.products.push($scope.tools[index].product);
        $scope.tools.splice(index,1);
    };

    //work types
    $scope.processWorkTypes = function() {
        $http.post('/installation/update_work_types',{ work_types : $scope.work_types}, {}).success(showResponse);
    };
    $scope.addWorkType = function() {
        $scope.work_types.push({
            name : '',
            price : 0.0
        });
    };
    $scope.deleteWorkType = function(index) {
        $scope.work_types.splice(index,1);
    };

    //hours
    $scope.processHours = function(){
        $http.post('/installation/update_hours',{ hours : $scope.hours}, {}).success(showResponse);
    };
    $scope.addHour = function() {
        $scope.hours.push({
            name : '',
            price : 0.0
        });
    };
    $scope.deleteHour = function(index) {
        $scope.hours.splice(index,1);
    };

    //zones
    $scope.processZones = function() {
        $http.post('/installation/update_zones',{ zones : $scope.zones}, {}).success(showResponse);
    };
    $scope.addZone = function() {
        $scope.zones.push({
            name : '',
            price : 0.0
        });
    };
    $scope.deleteZone = function(index) {
        $scope.zones.splice(index,1);
    };

});

app.controller('installationAddCTL',function($scope,$http) {
    $scope.cranes = window.cranes;
    $scope.materials = window.materials;
    $scope.tools = window.tools;
    $scope.work_types = window.work_types;
    $scope.zones = window.zones;
    $scope.products = window.products;
    $scope.installation = {};
    $scope.installation.staff = 1;
    $scope.installation.materials = [];
    $scope.installation.tools = [];
    $scope.installation.extras = [];
    $scope.step = 1;


    for (var i=0;i<$scope.products.length;i++) {
        for (var ti=0;ti<$scope.tools.length;ti++) {
            if ($scope.products[i].id == $scope.tools[ti].product.id) {
                $scope.tools[ti].product = $scope.products[i];
                //$scope.products.splice(i,1);
            }
        }
        for (var mi=0;mi<$scope.materials.length;mi++) {
            if ($scope.products[i].id == $scope.materials[mi].product.id) {
                $scope.materials[mi].product = $scope.products[i];
                //$scope.products.splice(i,1);
            }
        }
    }

    $scope.processInstallation = function(quoteID) {
        $scope.installation.quote = quoteID;

        $http.post('/installation/create',{installation : $scope.installation},{}).success(function(response) {

            var product = {
                price : $scope.calculateInstallationTotal() ,
                priceTotal :  $scope.calculateInstallationTotal(),
                product : 0,
                quantity : 1,
                saleQuote : quoteID,
                name : "Instalacion " + ($scope.installation.zone.name),
                installation : response.data.id
            };

            $http.post('/salesQuote/addProduct',{product : product}).then(function(r){
                if(r)
                    location.reload();
            });
        });
    };

    $scope.calculateInstallationTotal = function(){
        if ($scope.installation) {
            return ($scope.installation.zone ? $scope.installation.zone.price : 0)
                + ($scope.installation.staff ? $scope.installation.staff * 100 : 0)
                + ($scope.installation.materials.length > 0 ? $scope.calculateProductPrices($scope.installation.materials) : 0)
                + ($scope.installation.tools.length > 0 ? $scope.calculateProductPrices($scope.installation.tools) : 0)
                + ($scope.installation.crane ? $scope.calculateItemPrice($scope.installation.crane) : 0)
                + ($scope.installation.extras.length > 0 ? $scope.calculateItemPrices($scope.installation.extras) : 0);
        } else {
            return 0;
        }
    };

    $scope.calculateProductPrice = function(product){
        return product.quantity * (product.product.price.cost + (1 + (product.product.price.margin/100)));
    };

    $scope.calculateProductPrices = function(products) {
        var total = 0;
        for(var i=0;i<products.length;i++) {
            total += $scope.calculateProductPrice(products[i]);
        }
        return total;
    };

    $scope.calculateItemPrice = function(item){
        if (item) return item.quantity * item.price;
        else return 0;
    };

    $scope.calculateItemPrices = function(items) {
        var total = 0;
        if (items) {
            for(var i=0;i<items.length;i++) {
                total += $scope.calculateItemPrice(items[i]);
            }
        }
        return total;
    };

    $scope.addExtra = function(){
        $scope.installation.extras.push({ name : '',price : 0.0,quantity : 1 });
    };

    $scope.deleteExtra = function(index){
        $scope.installation.extras.splice(index,1);
    };

    $scope.setStep = function(step) {
        $scope.step = step;
    };

    //calendar stuff
    $scope.openedCalendar = false;
    $scope.minDate = new Date();
    $scope.formatDate = "dd-MM-yyyy";//['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'
    $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedCalendar = true;
    };

    $scope.dateOptions = {
        showWeeks : false
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
