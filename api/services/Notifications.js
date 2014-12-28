var notification = function(type,collection,val){
    if(val && val.req){//session info
        delete val['createdAt'];
        var obj = {
            companyId:val.req.companyId
            ,userId:val.req.userId
            ,app:val.req.app
            ,model:collection
            ,operation:type
            ,modifyId:val.id
            ,modelObjName:val.req.modelObjName || collection
            ,val:val
            ,modifications:[]
        };
        if(type == 'update'){
            Notice.findOne({modifyId:val.id}).sort('createdAt desc').exec(function(err,notice){
                if(err) throw err;
                if(notice && notice.val){
                    var changes = {}
                    , add = false;
                    obj.modifications = notice.modifications || [];
                    for(var v in val){
                        if(notice.val[v] != undefined && notice.val[v] != val[v] && v!='req'){
                            changes[v] = {
                                after:val[v]
                                ,before:notice.val[v]
                            }
                            add = true;
                        }
                    }
    				if(add){
                        obj.modifications.push(changes);
                    }
                }
                saveAndPublish(obj);
            });
        }else{
            saveAndPublish(obj);
        }
    }
};

module.exports = {
	after: function(Model,val,action){
		if(val.req && val.req.userId){
			notification(action,Model.tableName,val);
			val.req = {};
			/*Model.update({id:val.id},val).exec(function(err,model){
				if(err) throw err;
			});*/
		}
	}
	,before:function(val,action){
		if(val.req && val.req.user){
			var req = {
				userId:val.req.user.id
				,companyId:val.req.session.select_company || val.req.user.select_company
				,app: val.req.options.controller
			}
			if(val.name)
				req.modelObjName = val.name
			val.req = req;
		}
	}
};
var moment = require('moment');
module.exports.noticeSuscribe = function(req,find,cb){
	if(req.isSocket)
		req.socket.join('notices')

	var prefix = {
		Usuarios:'el'
		,Empresas:'la'
	}
	Notice.find({
		$query:find,orderby:{updatedAt:-1}
	}).exec(function(err,notices){
		if(err) return cb && cb(err);
		var users = []
		, apps = []
		, modify = [];
		for(var i=0;i<notices.length;i++){
			users.push(notices[i].userId);
			apps.push(notices[i].app);
			notices[i].date = moment(notices[i].createdAt).lang('es').fromNow();
			modify.push({
				id:notices[i].modifyId
				,model:notices[i].model
			});
		}
		User.find({id:users},{password:0}).exec(function(err,users){
			if(err) return cb && cb(err);
			var us = {};
			for(var i=0;i<users.length;i++){
				delete users[i].password;
				us[users[i].id] = users[i];
			}
			App.find({controller:apps}).exec(function(err,apps){
				if(err) return cb && cb(err);
				var ap = {};
				for(var i=0;i<apps.length;i++){
					apps[i].prefix = prefix[apps[i].name];
					apps[i].single = apps[i].name.replace(/s$/,"");
					ap[apps[i].controller] = apps[i];
				}
				return cb && cb(err,{
					noticesN:notices
					,usersN:us
					,appsN:ap
					,modifyN:modify
				});
			});
		});
	});
};

function saveAndPublish(obj){ 
    Notice.create(obj).exec(function(err,notice){
        if(err) throw err;
        //sails.io.sockets.in('notices').emit('update',{data:true});
        Notice.publishCreate({id:notice.id})
    });
}
