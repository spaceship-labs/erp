app.controller('userCTL',function($scope,$http,$rootScope){
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
        var r = {};
        r[$rootScope.translates.c_reg] = user.createdAtString;
        r[$rootScope.translates.c_last_acc] = user.lastAccessString;
        r[$rootScope.translates.c_email] = user.email;
        r[$rootScope.translates.c_phones] = user.phone;
		return r;
	};

    $scope.createUser = function(){
        //console.log($scope.user_form);
        if ($scope.user_form.$valid) {
            $http.post('/user/create',$scope.user,{}).success(function(data){
                console.log(data);
                showResponse(data);
                window.location.reload();
            });
        }
    }
});

app.controller('userEditCTL',function($scope,$http,_){
    $scope._ = _;
    $scope.content = content;
    $scope.user = user;
    $scope.user.permissions = [];
    $scope.apps = apps;
    $scope.submited_pass_form = false;
    $scope.company = company;
    $scope.user_roles = [];
    angular.copy(roles,$scope.user_roles);
    $scope.permissions = [];
    $scope.hiddenFields = [
        { key : 'userId',value : $scope.user.id }
    ];
    $scope.saveClassPermissions = 'fa-save';
    $scope.saveClassPassword = 'fa-save';

    var emptyRole = { name : 'Ninguno',permissions : [] ,id : '0' };
    for(var i in $scope.user.accessList){
        var acl = $scope.user.accessList[i];
        if (acl.company == $scope.company.id) {
            $scope.user.acl = acl;
            $scope.user.permissions = acl.permissions;
            $scope.isAdmin = acl.isAdmin;
            $scope.isRep = acl.isRep;

            emptyRole = { name : 'Ninguno',permissions : acl.permissions,id : '0' };

            if (acl.role) {
                $scope.user.role = _.findWhere($scope.user_roles,{ id : acl.role } );
            }
        }
    }
    if (!$scope.user.role) {
        $scope.user.role = emptyRole;
    }
    $scope.user_roles.push(emptyRole);

    $scope.updateAccestList = function(){
        //console.log($scope.user);
        $scope.saveClassPermissions = 'fa-upload';
        $http.post('/user/updateAccessList/', {
            user:$scope.user.id
            ,permissions: $scope.user.role.id ? $scope.user.role.permissions:$scope.user.permissions
            ,admin:$scope.isAdmin
            ,rep:$scope.isRep
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
    $scope.updateCompany = function(){
        console.log('update company??');
        console.log($scope.user.default_company);
        $http.post('/user/updateCompany/',{
            id:$scope.user.id
            ,default_company : $scope.user.default_company
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
    };
    $scope.$on('SAVE_ALL', function () {
        $scope.updateAccestList();
        $scope.updateCompany();
    });
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
        if (!permissionItem) {
            permissionItem = { key : key , value : false };
            $scope.selected_role.permissions.push(permissionItem);
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