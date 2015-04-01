app.controller('installationConfigCTL',function($scope,$http,_){
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
                console.log(i);
            }
        }
        for (var mi=0;mi<$scope.materials.length;mi++) {
            if ($scope.products[i].id == $scope.materials[mi].product.id) {
                $scope.materials[mi].product = $scope.products[i];
                //$scope.products.splice(i,1);
                console.log(i);
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
        //console.log($scope.cranes);
        $http.post('/installation/update_cranes',{ cranes : $scope.cranes}, {}).success(function(response){
            showResponse(response);
            $scope.craneForm.$setPristine();
        });
    };
    $scope.addCrane = function() {
        $scope.cranes.push({
            name : '',
            price_zone : _.map($scope.zones,function(zone){
                return { price : 0.0 , zone : zone.id };
            })
        });
    };
    $scope.deleteCrane = function(index) {
        var el = $scope.cranes[index];
        if (el.id) {
            $scope.deleteInstallationConfig('crane',el.id);
        }
        $scope.cranes.splice(index,1);
    };

    //materials
    $scope.processMaterials = function() {
        $http.post('/installation/update_materials',{ materials : $scope.materials}, {}).success(function(response){
            showResponse(response);
            $scope.materialForm.$setPristine();
        });
    };
    $scope.addMaterial = function() {
        if ($scope.selected_material && $scope.selected_material.id) {
            $scope.materials.push({product : $scope.selected_material });
            var index = $scope.products.indexOf($scope.selected_material);
            console.log(index);
            $scope.products.splice(index,1);
            $scope.selected_material = {};

        } else {
            console.log("producto error");
        }
    };
    $scope.deleteMaterial = function(index) {
        $scope.products.push($scope.materials[index].product);
        var el = $scope.materials[index];
        if (el.id) {
            $scope.deleteInstallationConfig('material',el.id);
        }
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
        var el = $scope.tools[index];
        if (el.id) {
            $scope.deleteInstallationConfig('tool',el.id);
        }
        $scope.tools.splice(index,1);
    };

    //work types
    $scope.processWorkTypes = function() {
        $http.post('/installation/update_work_types',{ work_types : $scope.work_types}, {}).success(showResponse);
    };
    $scope.addWorkType = function() {
        $scope.work_types.push({
            name : ''
        });
    };
    $scope.deleteWorkType = function(index) {
        var el = $scope.work_types[index];
        if (el.id) {
            $scope.deleteInstallationConfig('work_type',el.id);
        }
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
        var el = $scope.hours[index];
        if (el.id) {
            $scope.deleteInstallationConfig('hour',el.id);
        }
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
        var el = $scope.zones[index];
        if (el.id) {
            $scope.deleteInstallationConfig('zone',el.id);
        }
        $scope.zones.splice(index,1);
    };

    $scope.getCranePriceZone = function(crane,zone){
        if (crane.price_zones) {
            var price_zone = _.findWhere(crane.price_zones,{ zone : zone.id });
            if (price_zone) {
                return price_zone;
            }
        } else {
            crane.price_zones = [];
        }

        price_zone = {
            zone : zone.id,
            price : 0.0
        };
        crane.price_zones.push(price_zone);
        return price_zone;
    }

    $scope.deleteInstallationConfig = function(obj,id) {
        $http.post('/installation/delete_element',{ e : obj , id : id}, {}).success(showResponse);
    }

});

app.controller('installationCTL',function($scope,$http,_) {
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
    $scope.installation.work_type = [];
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

    $scope.createInstallation = function(quoteID) {
        $scope.installation.quote = quoteID;

        $http.post('/installation/create',{installation : $scope.installation},{}).success(function(response) {

            var priceTotal = $scope.calculateInstallationTotal();
            var product = {
                price :  priceTotal,
                price_total :  priceTotal,
                product : 0,
                quantity : 1,
                quote : quoteID,
                name : "Instalacion " + ($scope.installation.zone.name),
                installation : response.data.id
            };

            $http.post('/salesQuote/addProduct',{product : product}).then(function(r){
                if(r)
                    location.reload();
            });
        });
    };

    $scope.editInstallation = function(id){

    };

    $scope.calculateInstallationTotal = function(){
        if ($scope.installation) {
            return 0
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
        if (item && item.price_zones && $scope.installation.zone) {
            //console.log(item.price_zones);
            var iprice = _.findWhere(item.price_zones,{ zone : $scope.installation.zone.id });
            //console.log(iprice);
            return item.quantity * iprice.price;
        } else if (item) {
            return item.quantity * item.price;
        }
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
    $scope.minDate = new Date();
    $scope.formatDate = "dd-MM-yyyy";//['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'
    $scope.showWeeks = false;
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        showWeeks : false,
        'year-format': "'yy'",
        'starting-day': 1
    };
});