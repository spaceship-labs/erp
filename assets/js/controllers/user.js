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
	}
	
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
	}
});

app.controller('userEditCTL',function($scope){
	$scope.user = user;
	var id = user.id;
	$scope.updateAccestList = function(){
		io.socket.get('/user/editAjax/',{
			method:'accessList'
			,userId:id
			,accessList:$scope.user.accessList
		},function(data){
			var alt = jQuery('.alert p');
			alt.text(data.msg).parent().show();
		});
	}
});