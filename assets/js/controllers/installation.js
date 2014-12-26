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

app.controller('installationCTL',function($scope,$http) {
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

            var product = {
                price : $scope.calculateInstallationTotal() ,
                price_total :  $scope.calculateInstallationTotal(),
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
                + ($scope.installation.zone ? $scope.installation.zone.price : 0)
                + ($scope.installation.staff ? $scope.installation.staff * 100 : 0)
                + ($scope.installation.work_type && $scope.installation.materials.length > 0 ? $scope.installation.work_type.price : 0)
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