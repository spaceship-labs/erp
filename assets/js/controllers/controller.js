
app.directive('chosen',function(){
   var linker = function(scope,element,attrs){
       var list = attrs['chosen'];

        scope.$watchCollection(list,function(newvalue,oldvalue){
            //console.log(newvalue);
            //console.log(oldvalue);
            element.trigger('liszt:updated');
        });

        scope.$watch(attrs['ngModel'],function(newvalue,oldvalue){
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


app.controller('switchLangCTL',function($scope, $window){
    $scope.langs = [
        {label:'Español',value:'es'},
        {label:'English',value:'en'},
    ];
    $scope.setDefaults = function(){
        console.log(window.currentLang);
        if(window.currentLang == 'en'){
            $scope.currentLang = $scope.langs[1];
        }else{
            $scope.currentLang = $scope.langs[0];            
        }
    }
    $scope.switchLang = function(lang){
        console.log(lang);
        $window.location.href = '/home/changeLang?lang='+lang;
    }
});

app.controller('currencyCTL',function($scope){
	if(window.preload)
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
            price : ''
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
    $scope.machine.product_types = machine_product_types;//TODO cuando se serializa machine no trae el arreglo y tengo que serializarlo aparte

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
            price : ''
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

app.controller('productTypeCTL',function($scope,$http,$parse){
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

    function showResponseCreateProductType(data){
        if(data){
            if (data.text)
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.processForm = function(){
        $http.post('/product_type/create',$scope.product_type, {}).success(showResponseCreateProductType);
    };

});

app.controller('editProductTypeCTL',function($scope,$http){
    $scope.product_types = window.product_types;
    $scope.product_type =  window.product;
    $scope.inventory_types = window.inventory_type;
    $scope.saveClass = 'fa-save';

    var tmp = {};
    for(var i=0;i<window.sales_type.length;i++){
        tmp[window.sales_type[i].type] = window.sales_type[i].name;
    }
    $scope.sales_type = tmp;

    function showResponse(data){
        $scope.saveClass = 'fa-save';
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.processForm = function(){
        $scope.saveClass = 'fa-update';
        $http.post('/product_type/update',$scope.product_type, {}).success(showResponse);
    };

});

app.controller('saleAddClientCTL',function($scope,$http){
    $scope.createClient = function () {
        var client_form = { name : $scope.client_name,address : $scope.client_address,rfc : $scope.client_rfc , phone : $scope.client_phone };
        $http.post('/client/create_quote',client_form,{}).success(showResponse);
    };
});

function showResponse(data){
    console.log(data);
    if(data){
        if (data.text)
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
        if(data.url)
            window.location.href = data.url;
    }
};

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
