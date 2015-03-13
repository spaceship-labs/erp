

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

app.controller('productCTL',function($scope,$http,$filter){
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
                    var field = {
                        id : 0,
                        field: $scope.product_type.fields[i].id,
                        product: $scope.product.id,
                        value: "",
                        type: $scope.product_type.fields[i].type,
                        name: $scope.product_type.fields[i].name,
                        values: $scope.product_type.fields[i].values
                    };
                    $scope.aux_fields.push(field);
                }
            }
        }

        if (!$scope.product.price) {
            $scope.product.price = {
                cost : 0,
                margin : 0,
                id : 0
            };
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
        var number = $scope.product.price.cost * (1 + ($scope.product.price.margin/100));
        return number ? $filter('currency')(number) : "0.0";
    };

    $scope.calculateTotalInventory = function(){
        return parseInt($scope.product.quantity) + parseInt($scope.product.addInventory);
    };

    $scope.createProduct = function(){
        $http.post('/product/create',$scope.product,{}).success(function(data){
            if (data) {
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
                if (data.url) {
                    window.location.href = data.url;
                }
            }
        });
    };

    initialize();
});

app.controller('productsCTL',function($scope){
    $scope.products = typeof products != 'undefined' ? products : {};
});



app.controller('productAddCTL',function($scope,$http){
    $scope.products = window.products;
    $scope.product_types = window.product_types;
    $scope.machines_ = window.machines;
    $scope.product = {};
    $scope.machines = [];
    $scope.selected_machines = [];
    $scope.extras = [];
    $scope.selected_machines_for_real = [];

    $scope.processSelectedProduct = function(quoteID){
        var product = {
            price : $scope.calculateProductPrice() ,
            original_price : $scope.product.price.cost * (1 + ($scope.product.price.margin/100)),
            //price_total :  $scope.calculateProductPriceTotal(),
            product : $scope.product.id,
            quantity : $scope.product.quantity,
            quote : quoteID,
            name : $scope.product.sale_name,
            size : $scope.product.size,
            visible_size : $scope.product.visible_size,
            description : $scope.product.description
        };

        if ($scope.selected_machines_for_real) {
            product.machines = $scope.selected_machines_for_real;
        }

        if ($scope.extras) {
            product.extras = $scope.extras;
        }

        $http.post('/salesQuote/addProduct',{product : product}).then(function(r){
            if(r)
                location.reload();
        });
    };

    $scope.checkMachines = function(type){
        if ($scope.product.machines && $scope.product.machines.length > 0) {
            $scope.machines[type] = _.where($scope.product.machines,{ machine_type : type });
            //console.log($scope.machines);
            return $scope.machines[type].length > 0;
        }
        return false;
    };

    $scope.loadMachines = function(){
        var product_type = _.findWhere($scope.product_types,{ id : $scope.product.product_type.id });
        $scope.product.machines = _.map(product_type.machines,function(val){
            return _.findWhere($scope.machines_,{ id : val.id });
        });
    };

    $scope.calculateProductPrice = function(){
        var price = 0.0;
        var product_size = $scope.product.size ? (($scope.product.size.width || 0) * ($scope.product.size.height || 0)) : 0;
        var iterator = 0;
        if ($scope.selected_machines && _.isArray($scope.selected_machines)) {
            for(var i in $scope.selected_machines) {
                if (!angular.isUndefined(i) && !angular.isUndefined($scope.selected_machines[i].mode) && $scope.selected_machines[i].mode.price) {
                    price += parseFloat($scope.selected_machines[i].mode.price) * parseFloat(product_size);
                    $scope.selected_machines_for_real[iterator++] = $scope.selected_machines[i];
                }
            }
        }

        price += parseFloat(product_size) * $scope.product.price.cost * (1 + ($scope.product.price.margin/100));

        return price;
    };

    $scope.calculateProductPriceTotal = function(){
        var price = 0;
        if (_.size($scope.extras)){
            _.each($scope.extras,function(extra){
                price += extra.price * extra.quantity;
            });
        }
        return price + ($scope.calculateProductPrice() * $scope.product.quantity);
    };

    $scope.getExtraTotal = function() {
        return _.reduce($scope.extras,function(last,next){ return last + (next.price * next.quantity) },0);
    };

    $scope.generateDescription = function(){
        $scope.product.description = "";
        $scope.product.description += $scope.product.sale_name;
        $scope.product.description += $scope.product.size ? (" , " + $scope.product.size.width + " m. x " + $scope.product.size.height + " m.") : "";

        if ($scope.selected_machines && _.isArray($scope.selected_machines)) {
            for(var i in $scope.selected_machines) {
                if (!angular.isUndefined(i) && !angular.isUndefined($scope.selected_machines[i]) && $scope.selected_machines[i].mode.price) {
                    $scope.product.description += ' , ' + $scope.selected_machines[i].name;
                }
            }
        }
    };

    $scope.addExtra = function(){
        var extra = {
            name : '',
            quantity : 1,
            price : 0
        };

        $scope.extras.push(extra);
    };

    $scope.deleteExtra = function(index) {
        $scope.extras.splice(index,1);
    };
});