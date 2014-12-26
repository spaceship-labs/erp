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
    $scope.apps = apps;
    $scope.submited_pass_form = false;
    $scope.company = company;
    $scope.permissions = [];
    $scope.content = content;
    $scope.hiddenFields = [
        { key : 'userId',value : $scope.user.id }
    ];
    $scope.saveClassPermissions = 'fa-save';
    $scope.saveClassPassword = 'fa-save';

    console.log($scope.user);

    for(var i in $scope.user.accessList){
        var acl = $scope.user.accessList[i];
        if (acl.company == $scope.company.id) {
            $scope.user.permissions = acl.permissions;
            $scope.isAdmin = acl.isAdmin;
        }
    }

    var id = $scope.user.id;
    $scope.updateAccestList = function(){
        $scope.saveClassPermissions = 'fa-upload';
        $http.post('/user/updateAccessList/', {
            user:id
            ,permissions:$scope.permissions
            ,admin:$scope.isAdmin
            ,company : $scope.company.id
        },{}).success(function(data){
            $scope.saveClassPermissions = 'fa-save';
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
        },{}).success(showResponse);
    };

    $scope.updatePassword = function(){
        $scope.saveClassPassword = 'fa-upload';
        $scope.submited_pass_form = true;
        if ($scope.old_password && $scope.new_password && $scope.new_password == $scope.new_password_v && $scope.new_password != $scope.old_password) {
            $http.post('/user/updatePassword/',{
                userId:id
                ,old_password:$scope.old_password
                ,new_password:$scope.new_password
            },{}).success(function(data){
                $scope.saveClassPassword = 'fa-save';
                showResponse(data);
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
        var test = _.find($scope.user.permissions,
            function(item){
                return item.key == key;
            });
        if (test)
            return test.value;
        return false;
    };

    $scope.setPermission = function(key,app) {
        var permissionItem = { key : key , value : $scope.getPermission(key) };

        app.permissions.selected.push(key);
        if (permissionItem.value) {
            app.permissions.granted.push(key);
        }

        $scope.permissions.push(permissionItem);
        var index = $scope.permissions.indexOf(permissionItem);
        return $scope.permissions[index];
    };

    $scope.onlyRestricted = function(item) {
        if (item.handle) {
            return true;
        }
        return false;
    }
});