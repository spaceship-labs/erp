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
    $scope.company = company;
    $scope.permissions = [];

    for(var index in $scope.user.accessList){
        var acl = $scope.user.accessList[index];
        if (acl.company == $scope.company.id) {
            $scope.user.permissions = [];
            for (var index1 in acl.permissions) {
                $scope.user.permissions[acl.permissions[index1][0]] = acl.permissions[index1][1];
            }
            console.log($scope.user.permissions);
            console.log(acl.permissions);
            $scope.isAdmin = acl.isAdmin;
        }
    }
    var id = $scope.user.id;
    $scope.updateAccestList = function(){
        console.log($scope.permissions);
        var permisosk = [];
        var permisosv = [];
        for (var key in $scope.permissions) {
            permisosk.push(key);
            permisosv.push($scope.permissions[key]);
        }
        $http.post('/user/updateAccessList/', {
            user:id
            ,permissionsk:permisosk
            ,permissionsv:permisosv
            ,admin:$scope.isAdmin
            ,company : $scope.company.id
        },{}).success(function(data){
            //console.log(data);
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
            console.log($scope.old_password);
            console.log($scope.new_password.$valid);
            console.log($scope.new_password_v);
        }
    };

    $scope.filterApp = function(app){
        return ($scope.company.apps.indexOf(app.name) != -1);
    };

    $scope.getPermission = function(key){
        return $scope.user.permissions[key];
    };
});