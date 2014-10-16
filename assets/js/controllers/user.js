app.controller('userCTL',function($scope){
$scope.users = users;
	$scope.userFilter = function(u){		
		if($scope.searchInputSelect && !$scope.searchInput){
			//return true;
			return $scope.searchInputSelect == u.last_name[0].toUpperCase();
		}else{
			var regex = new RegExp('^'+$scope.searchInput,'i');
			var name = u.name+' '+u.last_name;
			return name.match(reg);
		}
	};
	
	updateNotices($scope,'/home/noticeSuscribeApp',{app:'users'},function(){
		//updateList();	
	});
	$scope.getInfo = function(user){
		return {
			"Registro":user.createdAtString,
			"Ultimo acceso":user.lastAccessString,
			"Email":user.email,
			"Telefono":user.phone,
		}
	};

    $scope.createUser = function(){

        $http.post('/user/create',createUserForm,{}).success(function(data) {
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

app.controller('userEditCTL',function($scope,$http){
    $scope.user = user;
    $scope.apps = apps;
    $scope.submited_pass_form = false;
    var id = user.id;
    $scope.updateAccestList = function(){
        io.socket.get('/user/editAjax/',{
            method:'accessList'
            ,userId:id
            ,accessList:$scope.user.accessList
            ,admin:$scope.user.isAdmin
        },function(data){
            var alt = jQuery('.alert p');
            alt.text(data.msg).parent().show();
        });
    };

    $scope.updateInfo = function(){
        $http.post('/user/updateInfo/',{
            userId:id
            ,name:$scope.user.name
            ,last_name:$scope.user.last_name
            ,phone:$scope.user.phone
            ,email:$scope.user.email
            ,active:$scope.user.active
        },{}).success(function(data){
            var alt = jQuery('.alert p');
            alt.text(data.text).parent().show();
        });
    };

    $scope.updatePassword = function(){
        if ($scope.old_password && $scope.new_password && $scope.new_password == $scope.new_password_v && $scope.new_password != $scope.old_password) {
            $http.post('/user/updatePassword/',{
                userId:id
                ,old_password:$scope.old_password
                ,new_password:$scope.new_password
            },{}).success(function(data){
                var alt = jQuery('.alert p');
                alt.text(data.text).parent().show();
            });
        } else {
            console.log("damn");
            console.log($scope.old_password);
            console.log($scope.new_password.$valid);
            console.log($scope.new_password_v);
        }
    };

    $scope.filterPermissionsApp = function(app){
        //console.log(app);
        if (app.permissions) return true;
        return false;
    }

});