app.controller('userCTL',function($scope,$http){
    $scope.users = users;
    $scope.content = content;

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
			"Telefono":user.phone
		}
	};

    $scope.createUser = function(){
        //console.log($scope.user_form);
        if ($scope.user_form.$valid) {
            $http.post('/user/create',$scope.user,{}).success(function(data){
                console.log(data);
                showResponse(data);
            });
        }
    }
});

app.controller('userEditCTL',function($scope,$http,_){
    $scope.user = user;
    $scope.user.permissions = [];
    $scope.apps = apps;
    $scope.submited_pass_form = false;
    $scope.company = company;
    $scope.roles = roles;
    $scope.user_roles = [];
    $scope.permissions = [];
    $scope.content = content;
    $scope.hiddenFields = [
        { key : 'userId',value : $scope.user.id }
    ];
    $scope.saveClassPermissions = 'fa-save';
    $scope.saveClassPassword = 'fa-save';
    $scope._ = _;
    $scope.selected_role = { permissions : [] };

    for(var i in $scope.user.accessList){
        var acl = $scope.user.accessList[i];
        if (acl.company == $scope.company.id) {
            $scope.user.acl = acl;
            $scope.user.permissions = acl.permissions;
            $scope.isAdmin = acl.isAdmin;
            angular.copy($scope.roles,$scope.user_roles);

            var emptyRole = { name : 'Ninguno',permissions : acl.permissions,id : '0' };
            $scope.user_roles.push(emptyRole);

            if (acl.role) {
                $scope.user.role = _.findWhere($scope.user_roles,{ id : acl.role } );
            } else {
                $scope.user.role = emptyRole;
            }
        }
    }

    $scope.updateAccestList = function(){
        //console.log($scope.user);
        $scope.saveClassPermissions = 'fa-upload';
        $http.post('/user/updateAccessList/', {
            user:$scope.user.id
            ,permissions: $scope.user.role.id ? $scope.user.role.permissions:$scope.user.permissions
            ,admin:$scope.isAdmin
            ,company : $scope.company.id
            ,role : $scope.user.role.id
        },{}).success(function(data){
            $scope.saveClassPermissions = 'fa-save';
            var alt = jQuery('.alert p');
            alt.text(data.msg).parent().show();
        });
    };

    $scope.updateInfo = function(){
        $http.post('/user/updateInfo/',{
            userId:$scope.user.id
            ,name:$scope.user.name
            ,last_name:$scope.user.last_name
            ,phone:$scope.user.phone
            ,email:$scope.user.email
            ,active:$scope.user.active
        },{}).success(showResponse);
    };

    $scope.updatePassword = function(){
        $scope.saveClassPassword = 'fa-upload';
        $scope.submited_pass_form = true;
        if ($scope.old_password && $scope.new_password && $scope.new_password == $scope.new_password_v && $scope.new_password != $scope.old_password) {
            $http.post('/user/updatePassword/',{
                userId:$scope.user.id
                ,old_password:$scope.old_password
                ,new_password:$scope.new_password
            },{}).success(function(data){
                $scope.saveClassPassword = 'fa-save';
                showResponse(data);
            });
        }
    };

    $scope.filterApp = function(app){
        return ($scope.company.apps.indexOf(app.name) != -1);
    };


    $scope.getPermission = function(key) {
        var permissionItem = _.findWhere($scope.user.permissions,{ key : key });
        if (!permissionItem) {
            permissionItem = { key : key , value : false };
            $scope.user.permissions.push(permissionItem);
        }
        var index = $scope.user.permissions.indexOf(permissionItem);
        return $scope.user.permissions[index];
    };

    $scope.onlyRestricted = function(item) {
        if (item.handle) {
            return true;
        }
        return false;
    }
});

app.controller('userRoleCTL',function($scope,$http,_) {
    $scope.user = user;
    $scope.apps = apps;
    $scope.company = company;
    $scope.roles = roles;

    $scope._ = _;
    $scope.selected_role = { permissions : [] };

    $scope.saveUserRole = function(){
        $http.post('/user/saveRole/', {
            role : $scope.selected_role.id || 0,
            name : $scope.selected_role.name,
            permissions:$scope.selected_role.permissions,
            company : $scope.company.id,
            isNew : $scope.isNew
        },{}).success(function(data){
            var alt = jQuery('.alert p');
            alt.text(data.text).parent().show();
            if (data.success) {
                if ($scope.isNew) {
                    $scope.roles.push(data.role);
                    //$scope.user_roles.push(data.role);
                }
            }
            //jQuery('#userRoleModal').modal('hide');
        });
    };


    $scope.filterApp = function(app){
        return ($scope.company.apps.indexOf(app.name) != -1);
    };

    $scope.getRolePermission = function(key) {
        var permissionItem = _.findWhere($scope.selected_role.permissions,{ key : key } );
        //console.log(permissionItem);
        if (!permissionItem) {
            permissionItem = { key : key , value : false };
            $scope.selected_role.permissions.push(permissionItem);
            //console.log($scope.selected_role);
        }
        var index = $scope.selected_role.permissions.indexOf(permissionItem);
        return $scope.selected_role.permissions[index];
    };

    $scope.onlyRestricted = function(item) {
        if (item.handle) {
            return true;
        }
        return false;
    }
});