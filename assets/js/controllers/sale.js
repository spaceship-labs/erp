

app.controller('saleQuoteCTL',function($scope,$http,$filter,_){
    $scope.quote = quote;
    $scope.clients = clients;
    $scope.detail = false;


    $scope.quote.client =  _.findWhere($scope.clients, { id : $scope.quote.client.id });
    $scope.quote.deliver_to =  _.findWhere($scope.clients, { id : $scope.quote.deliver_to.id });
    $scope.quote.bill_to =  _.findWhere($scope.clients, { id : $scope.quote.bill_to.id });

    function showResponse(data) {
        if(data){
            console.log(data);
            //location.reload();
        }
    };

    $scope.calculateSurface = function(){
        var totalSize = _.reduce($scope.quote.products, function(memo, product){ return memo + (product.size ? (product.size.width * product.size.height) : 0.0); }, 0.0);
        return $scope.quote.products.length > 0 ? totalSize : '0.0';
    };

    $scope.priorities = [
        {value : 'normal',text : 'normal'},
        {value : 'fast',text : 'rapido'},
        {value : 'urgent',text : 'urgente'}
    ];

    $scope.delivery_modes = [
        { value : 'pickup' , text : 'Cliente recoge' },
        { value : 'deliver' , text : 'Envio'}
    ]

    $scope.showPriority = function(){
        var selected = $filter('filter')($scope.priorities, { value: $scope.quote.priority });
        return ($scope.quote.priority && selected.length) ? selected[0].text : 'elegir';
    };

    $scope.updateStatus = function(){
        $http.post('/salesQuote/updateStatus/' + $scope.quote.id,{ status : $scope.quote.status },{}).success(function(response) {
            console.log(response);
            //if (response.success) {
                //alert(response);
            //}
        });
    };

    $scope.setAttribute = function(field,value) {
        console.log(value);
        $http.post('/salesQuote/updateAttribute/' + $scope.quote.id,{ value : value, field : field },{}).success(function(response) {
            console.log(response);
        });
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

    //calendar stuff
    $scope.minDate = new Date();
    $scope.formatDate = "dd-MM-yyyy";//['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'
    $scope.showWeeks = false;
    $scope.opened = [];

    $scope.open = function($event,id) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[id] = true;
    };

    $scope.dateOptions = {
        showWeeks : false,
        'year-format': "'yy'",
        'starting-day': 1
    };
});


app.controller('salesQuotesCTL',function($scope,$http){
    $scope.quotes = window.quotes;
});

app.controller('saleQuoteAddCTL',function($scope,$http) {
    $scope.selectedProducts = [];
    $scope.products = [];
    $scope.clients = [];
    $scope.client = { id : 0};
    $scope.total = 0;


    console.log($scope.clients);

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
            client : $scope.client.id,
            name : $scope.name
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
    $scope.quote = quote;

    $scope.clients = clients;
    $scope.detail = false;


    $scope.quote.client =  _.findWhere($scope.clients, { id : $scope.quote.client.id });
    $scope.quote.deliver_to =  _.findWhere($scope.clients, { id : $scope.quote.deliver_to.id });
    $scope.quote.bill_to =  _.findWhere($scope.clients, { id : $scope.quote.bill_to.id });

    function showResponse(data) {
        if(data){
            console.log(data);
            //location.reload();
        }
    };

    $scope.calculateSurface = function(){
        var totalSize = _.reduce($scope.quote.products, function(memo, product){ return memo + (product.size ? (product.size.width * product.size.height) : 0.0); }, 0.0);
        return $scope.quote.products.length > 0 ? totalSize : '0.0';
    };

    $scope.delivery_modes = [
        { value : 'pickup' , text : 'Cliente recoge' },
        { value : 'deliver' , text : 'Envio'}
    ];

    $scope.setQuoteAttribute = function(field,value) {
        console.log(value);
        $http.post('/salesQuote/updateAttribute/' + $scope.quote.id,{ value : value, field : field },{}).success(function(response) {
            console.log(response);
        });
    };

    $scope.setAttribute = function(field,value) {
        console.log(value);
        $http.post('/saleOrder/updateAttribute/' + $scope.order.id,{ value : value, field : field },{}).success(function(response) {
            console.log(response);
        });
    };

    $scope.totalQuote = function(){
        //console.log($scope.quote.products);
        var totalAmount = 0.0;
        angular.forEach($scope.quote.products,function(product){
            totalAmount += product.price_total;
        });
        return totalAmount;
    };

    //calendar stuff
    $scope.minDate = new Date();
    $scope.formatDate = "dd-MM-yyyy";//['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'
    $scope.showWeeks = false;
    $scope.opened = [];

    $scope.open = function($event,id) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[id] = true;
    };

    $scope.dateOptions = {
        showWeeks : false,
        'year-format': "'yy'",
        'starting-day': 1
    };
});

app.controller('saleOrderConfigCTL',function($scope,$http){
    $scope.config = config;

    console.log($scope.config);
});