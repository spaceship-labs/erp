app.controller('companyCTL',function($scope,$http,$rootScope){
    $scope.companies = companies;
    $scope.content = content;
    $scope.currencies = currencies;
    $scope.company = selected_company;
    $scope.user = user;
    $scope.company_types = [{id:'agency',name:'Agencia'},{id:'transport',name:'Transportista'}];
    //$scope.apps = apps;

    $scope.getInfo = function(company){
        var r = {};
        r[$rootScope.translates.c_adress] = company.address;
        if(company.apps){
            r["Apps"] = company.apps.join(', ');
            r[$rootScope.translates.c_baseCurrency] = company.base_currency;
        }
        return r;
    };

    $scope.createCompany = function(newcompany){
        newcompany.users = [ user.id ];
        $http({method: 'POST', url: '/company/create',data:newcompany}).success(function (company){
            $scope.companies.push(newcompany);
            jQuery('#companyCreate').modal('hide');
            window.location.reload();
        });    
    };
});
app.controller('companyEditCTL',function($scope,$http,$timeout){
    $scope.company = company;
    $scope.mycompany = mycompany;
    $scope.content = content;
    $scope.allApps = apps;
    $scope.users = users;
    $scope.hotels = hotels;
    $scope.tours = [];
    $scope.transfers = {};
    $scope.hotels = {};
    $scope.currencies = currencies || [];
    $scope.missingApps = [];
    $scope.selectedApps = [];
    $scope.showTaxForm = false;
    $scope.newTaxClass = 'fa-plus';
    $scope.isCollapseObj = {};
    $scope.locations = [];
    $scope.exchangerates = $scope.mycompany.exchange_rates || {};
    //$scope.mycompany.company_type = mycompany.company_type || 'agency';
    console.log($scope.mycompany);
    $scope.actualCurrency = $scope.mycompany.base_currency || $scope.company.base_currency;
    $scope.messages = {
        tour : { show : false , m : '' , message_add : "Nuevo Tour agregado al catálogo: " , message_rm : 'Tour eliminado del catálogo: ' , item_name : '' , type : 'success' }
        ,transfer : { show : false , m : '' , message_add : "Nuevo Servicio agregado al catálogo: " , message_rm : 'Servicio eliminado del catálogo: ' , item_name : '' , type : 'success' }
        ,hotel : { show : false , m : '' , message_add : "Nuevo Hotel agregado al catálogo: " , message_rm : 'Hotel eliminado del catálogo: ' , item_name : '' , type : 'success' }
    };
    $scope.company_types = [{id:'agency',name:'Agencia'},{id:'transport',name:'Transportista'}];
    var setMessage = function(section,action,name,alertType,show){
        if(show){
            $scope.messages[section].m = action=='add'?$scope.messages[section].message_add:$scope.messages[section].message_rm;
            $scope.messages[section].item_name = name;
            $scope.messages[section].alertType = alertType;
            $scope.messages.tour.show = false;
            $scope.messages.transfer.show = false;
            $scope.messages.hotel.show = false;
            $scope.messages[section].show = true;
            $timeout(function(){
                setMessage(section,false,false,false,false);
            }, 5000);
        }else{
            $scope.messages[section].show = false;
        }
    }
    $scope.admin_currencies = window.admin_currencies;
    $scope.currencies_id = window.currencies.map(function(c){
                                    return c.id;
                                });
    //$scope.companies = companies;
    $scope.updateExchangeRates = function(){
        console.log($scope.exchangerates);
        var params = { id : $scope.mycompany.id , exchange_rates : $scope.exchangerates };
        $http({method: 'POST', url: '/company/update_exchangerates',data:params}).success(function(result){
            console.log(result);
        });
    }
    var updateApps = function(){
        $scope.missingApps = [];
        $scope.selectedApps = [];
        if($scope.mycompany.apps){
            angular.forEach($scope.allApps,function(app){
                if ($scope.mycompany.apps.indexOf(app.name) == -1) {
                    $scope.missingApps.push(app);
                } else {
                    $scope.selectedApps.push(app);
                }
            });
        }else{
            $scope.missingApps = $scope.allApps;
        }
    };
    $scope.removeApp = function(app){
        io.socket.post('/company/removeApp',{company:$scope.mycompany.id,app:app.name},function(company){
            $scope.mycompany = company;
            updateApps();
            $scope.$apply();
        });
    };
    $scope.addApp = function(app){
        io.socket.post('/company/addApp',{company:$scope.mycompany.id,app:app.name},function(company){
            $scope.mycompany = company;
            updateApps();
            $scope.$apply();
        });
    };
    updateApps();
    $scope.removeUser = function(user){
        io.socket.post('/company/removeUser',{company:$scope.mycompany.id,user:user.id},function(result){
            var indexU = $scope.company.users.indexOf(user);
            $scope.mycompany.users.splice(indexU,1);
            $scope.$apply();
        });
    };
    $scope.addUser = function(user){
        io.socket.post('/company/addUser',{company:$scope.mycompany.id,user:user.id},function(result){
            $scope.mycompany.users.push(user);
            $scope.$apply();
        });
    };
    $scope.removeHotel = function(hotel){
        io.socket.post('/company/removeHotel',{company:$scope.mycompany.id,hotel:hotel.id},function(result){
            var indexU = $scope.mycompany.hotels.indexOf(hotel);
            $scope.mycompany.hotels.splice(indexU,1);
            $scope.$apply();
        });
    };
    $scope.addHotel = function(hotel){
        io.socket.post('/company/addHotel',{company:$scope.mycompany.id,hotel:hotel.id},function(result){
            if($scope.mycompany.hotels === undefined) {
                $scope.mycompany.hotels = [];
            }
            $scope.mycompany.hotels.push(hotel);
            $scope.$apply();
        });
    };
    $scope.filterUsers = function(user) {
        var found = false;
        angular.forEach($scope.mycompany.users,function(suser){
            if (user.id == suser.id) {
                found = true;
            }
        });
        return !found;
    };
    $scope.filterHotels = function(hotel) {
        var found = false;
        angular.forEach($scope.mycompany.hotels,function(shotel){
            if (hotel.id == shotel.id) {
                found = true;
            }
        });
        return !found;
    };
    $scope.toggleNewTax = function(){
        $scope.showTaxForm = !$scope.showTaxForm;
        $scope.newTaxClass = $scope.showTaxForm ? 'fa-minus' : 'fa-plus';
    };
    $scope.addTax = function(){
        $scope.tax.company = $scope.mycompany.id;
        $scope.showTaxForm = false;
        $http({method: 'POST', url: '/company/add_tax',data:$scope.tax}).success(function(result){
            $scope.mycompany.taxes.push($scope.tax);
            $scope.tax = {};
            $scope.newTaxClass = 'fa-plus';
        });
    };
    $scope.getTours = function(val) {
        return $http.get('/tour/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.acOnSelect = function($item, $model, $label,type,spVar){
        addProduct($item,type,spVar);
    };
    var addProduct = function(product,type,spVar){
        var form = { 
            agency : $scope.mycompany.id, product_type : type
            ,commission_agency : 0, fee : 0, feeChild : 0 };
        form[type] = product.id;
        if( type == 'transfer' )
            form.location = $scope.thelocation;
        $http({method: 'POST', url: '/companyproduct/addproducttocompany',data:form}).success(function(result){
            //console.log(result);
            var name = '';
            if( type == 'transfer' ){
                angular.extend($scope.transfers,result)
                name = product.name;
            }else{
                $scope[spVar].push(result);
                name = result[type].name;
            }
            console.log(product);
            console.log(result);
            setMessage(type,'add',name,'success',true);
        });
    };
    $scope.getProducts = function(type,spVar,skip){
        var params = {
            product_type : type
            ,agency : $scope.mycompany.id
        };
        if( type == 'transfer' )
            params.location = $scope.thelocation;
        console.log('companyproduct');
        console.log(params);
        $http({method: 'POST', url: '/companyproduct/find',data:params}).success(function(result){
            $scope[spVar] = result;
            //console.log('products: ' + type);
            //console.log(result);
        });
    };
    $scope.getProducts('tour','tours',0);
    //$scope.getProducts('transfer','transfers',0);
    $scope.getProducts('hotel','hotels',0);
    $scope.savePrice = function(data,price){
        //data.fee = data.fee==0&&data.commission_agency!=0?(price.tour.fee-(price.tour.fee*(data.commission_agency/100))):data.fee;
        //data.feeChild = data.feeChild==0&&data.commission_agency!=0?(price.tour.feeChild-(price.tour.feeChild*(data.commission_agency/100))):data.feeChild;
        angular.extend(data, { id : price.id });
        $http({method: 'POST',url:'/companyproduct/update',params:data}).success(function(t){
            t = t[0];
            price.fee = t.fee;
            price.feeChild = t.feeChild;
            price.commission_agency = t.commission_agency;
        });
    };
    $scope.removeProduct = function(price,type){
        var data = { id : price.id };
        var price_aux = price[type].name;
        $http({method: 'POST',url:'/companyproduct/removeproduct',params:data}).success(function(t){
            index = $scope.tours.map(function(e) { return e.id; }).indexOf(price.id);
            $scope.tours.splice(index,1);
            setMessage(type,'remove',price_aux,'error',true);
        });
    };
    $scope.getTransfers = function(val){
        return $http.get('/transfer/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.saveTransferPrice = function(data,price){
        angular.extend(data, { id : price });
        return $http.post('/transferprice/updatePrice', data);
    };
    $scope.getHotels = function(val){
        return $htçtp.get('/hotel/find', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.getCities = function(val){
        return $http.get('/location/customfind', { params: { name: val } }).then(function(response){
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.updateTourPrices = function(){
        var params = $scope.tourF;
        if(params.tlocation) params.tlocation = params.tlocation.id;
        $http({method: 'POST',url:'/companyproduct/updatetourbyfilter',params:params}).success(function(results){
            //console.log('results update by filters');console.log(results);
            $scope.getProducts('tour','tours',0);
        });
    };
    $scope.getLocations = function(){
        $http({method: 'POST',url:'/location/customfind',params:{}}).success(function(results){
            console.log('results get locations');
            console.log(results);
            $scope.locations = results.results;
            for(var x in $scope.locations)
                if( $scope.locations[x].url_title == 'cancun' ) $scope.thelocation = $scope.locations[x].id;
            if( ! $scope.thelocation )
                $scope.thelocation = $scope.locations[0];
            $scope.getProducts('transfer','transfers',0);
        });
    }
    $scope.getLocations();

    $scope.add_currency = function(){
        if($scope.select_currency){
            var url = '/company/' + $scope.mycompany.id + '/currencies/' + $scope.select_currency;
            $http({method: 'POST', url: url}).success(cbUpdateCurrencies); 
        }
    };

    $scope.remove_currency = function(id){
        if(id){
            var url = '/company/' + $scope.mycompany.id + '/currencies/' + id;
            $http({method: 'delete', url: url }).success(cbUpdateCurrencies);
        }
    };
    $scope.addAllTours = function(){}

    function cbUpdateCurrencies(company){
        if(company && company.currencies){
            $scope.currencies = company.currencies;
            $scope.currencies_id = company.currencies.map(function(c){
                                    return c.id;
                                });
        }
    
    }
});
