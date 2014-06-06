var notification = function(type,collection,val){
	if(val && val.req){//session info
		Notice.create({
			companyId:val.req.companyId
			,userId:val.req.userId
			,app:val.req.app
			,model:collection
			,operation:type
			,modifyId:val.id
		}).exec(function(err,notice){
			if(err) throw err;
			sails.io.sockets.in('notices').emit('update',{data:true});
		});
	}
};

module.exports = {
	after: function(Model,val,action){
		if(val.req && val.req.userId){
			notification(action,Model.tableName,val);
			val.req = {};
			Model.update({id:val.id},val).exec(function(err,model){
				if(err) throw err;
			});
		}
	}
	,before:function(val){
		if(val.req && val.req.user){
			var req = {
				userId:val.req.user.id
				,companyId:val.req.session.select_company || val.req.user.select_company
				,app: val.req.options.controller
			}
			val.req = req;	
		}
	}
};
