

app.controller('clientCTL',function($scope,$http){
    $scope.content = content;
    $scope.client = {};

    jQuery('form').ajaxForm(function(data){
        if(data){
            jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    });

    function showResponse(data){
        if(data){
            if (data.text)
                jQuery('.alert p').text(data.text).parent().removeClass('unseen');
            if(data.url)
                window.location.href = data.url;
        }
    };

    $scope.createClient = function () {
        console.log($scope.client);
        $http.post('/clientes/crear',$scope.client,{}).success(showResponse);
    };
});

app.controller('clientEditCTL',function($scope,$http){
    $scope.client = client;
    $scope.content = content;
    $scope.products = products;
    $scope.showContactForm = false;
    $scope.newContactClass = 'fa-plus';
    $scope.contact = { };
    $scope.selected_products = [];

    console.log($scope.products);

    angular.forEach($scope.products,function(product) {
        angular.forEach($scope.client.product_discounts,function(discount) {
            if (product.id == discount.product) {
                product.discount = discount.discount;
                product.discount_type = discount.discount_type;
                $scope.selected_products.push(product);
            }
        });
    });

    $scope.hiddenFields = [
        { key : 'client',value : $scope.client.id }
    ];

    $scope.contact_types = [
        {
            id : 'contact',
            name : 'cotizaciones'
        },
        {
            id : 'sale',
            name : 'ventas'
        },
        {
            id : 'all',
            name : 'todos'
        }
    ];

    $scope.toggleNewContact = function(){
        $scope.showContactForm = !$scope.showContactForm;
        $scope.newContactClass = $scope.showContactForm ? 'fa-minus' : 'fa-plus';
    };

    $scope.toggleMenu = function(product) {
        console.log(product);
        product.showMenu = !product.showMenu;
    };

    $scope.setMenu = function(product) {
        product.showMenu = false;
        product.finalPrice = $scope.calculatePrice(product);
    };

    $scope.addContact = function(contact){
        $scope.contact.client = $scope.client.id;
        $scope.newContactClass = 'fa-upload';
        $scope.showContactForm = false;
        $http({method: 'POST', url: '/client/add_contact',data:$scope.contact}).success(function(result){
            $scope.client.contacts = result.contacts;
            $scope.contact = {};
            $scope.newContactClass = 'fa-plus';
        });
    };

    $scope.calculatePrice = function(product) {
        var result = product.cost * (1 + ((product.margin ? product.margin : 0)/100));

        if (angular.isUndefined(product.symbol) || angular.isUndefined(product.discount)) {
            return result;
        }

        if (product.symbol == '=') {
            return product.discount;
        }

        if (product.symbol == '$') {
            result -= product.discount;
        }

        if (product.symbol == '%') {
            result -= (result * ((product.discount ? product.discount : 0)/100));
        }

        console.log(result);

        if (result < 0) {
            return 0;
        }
        return result;
    };

    $scope.specialPriceProcess = function() {
        var discounts = $scope.selected_products.map(function(product_discount) {
            var discount = {
                discount : product_discount.discount,
                discount_type : product_discount.discount_type == '%' ? 'percentage_discount':'amount_discount',
                product : product_discount.id,
                client : $scope.client.id,
                name : product_discount.name
            };
            return discount;
        });
        $http({method: 'POST', url: '/client/add_discounts',data:{ id : $scope.client.id , product_discounts : discounts , discount : $scope.client.discount }}).success(function(result){
            jQuery('.alert p').text(result.text).parent().removeClass('unseen');
        });
    };
});
