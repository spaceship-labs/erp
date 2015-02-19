

app.controller('saleQuoteCTL',function($scope,$http){
    $scope.quote = quote;

    function showResponse(data) {
        if(data){
            location.reload();
        }
    };

    $scope.deleteProduct = function(product,quote){
        var answer = confirm("Estas seguro que quieres borrar este elemento ?");
        if (answer) {
            var data = {
                product : product,
                quote : quote
            };
            $http.post('/salesQuote/removeProduct',data,{}).success(showResponse);
        }
    };

    $scope.editProduct = function(product){

    };

    $scope.totalQuote = function(){
        //console.log($scope.quote.products);
        var totalAmount = 0.0;
        angular.forEach($scope.quote.products,function(product){
            totalAmount += product.price_total;
        });
        return totalAmount;
    };

    //calendar
    $scope.minDate = new Date();

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
});

app.controller('saleQuoteAddCTL',function($scope,$http) {
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
        $http.get('/client/clientsJson').then(function (response) {
            $scope.clients = response.data;
        });
    };

    $scope.processForm = function(){
        var dataObject = {
            client : $scope.client.id
        };
        $http.post('/SalesQuote/add',dataObject, {}).success(showResponse);
    };

    $scope.initialize();
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

app.controller('saleOrderCTL',function($scope,$http){
    $scope.order = order;

    console.log($scope.order);
});

app.controller('saleOrderConfigCTL',function($scope,$http){
    $scope.config = config;

    console.log($scope.config);
});