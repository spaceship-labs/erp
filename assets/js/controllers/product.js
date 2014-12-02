

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
    $scope.saveClass = 'fa-save';
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

//    $scope.processInfo = function() {
//        $scope.saveClass = 'fa-update';
//        //$http.post('/product/update',)
//    };
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
        var price = 0;
        if ($scope.product.machines && $scope.product.machines.length > 0 && $scope.selected_machine) {
            price = $scope.selected_machine.ink_cost * (1 + ($scope.selected_machine.ink_utility/100));
        }
        if ($scope.product.cut_price && $scope.product.cut){
            price += $scope.product.cut_price
        }
        price += $scope.product.price.cost * (1 + ($scope.product.price.margin/100));
        return price;
    };

    $scope.calculateProductPriceTotal = function(){
        return $scope.calculateProductPrice() * $scope.product.quantity;
    };
});