

app.controller('clientCTL',function($scope,$http){
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
        //console.log($scope.client_form);
        var client_form = { name : $scope.client_name,address : $scope.client_address,rfc : $scope.client_rfc , phone : $scope.client_phone };
        $http.post('/clientes/crear',client_form,{}).success(showResponse);
    };
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