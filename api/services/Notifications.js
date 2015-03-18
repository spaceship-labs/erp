var notification = function(type,collection,val){
	console.log('req');
	console.log(val);
    if(val && val.req){//session info
        delete val['createdAt'];
        var obj = {
            companyId:val.req.companyId
            ,userId:val.req.userId
            ,app:val.req.app
            ,model:collection.tableName
            ,operation:type
            ,modifyId:val.id
            ,modelObjName:val.req.modelObjName
            ,val:val
            ,modifications:[]
        };
        console.log('notice');
        console.log(type);
        console.log(obj);
        if(type == 'update'){
            Notice.findOne({modifyId:val.id}).sort('createdAt desc').exec(function(err,notice){
                if(err) throw err;
                var add = true;
                if(notice && notice.val){
                    var changes = {};
                    add = false;
                    obj.modifications = notice.modifications || [];
                    for(var v in val){
                        if(v!='req' && !Common.equals(notice.val[v],val[v])){
                            changes[v] = {
                                after:val[v]
                                ,before:notice.val[v]
                                ,dataType:Common.getCollectionAttrType(collection.attributes,v)
                            }
                            add = true;
                        }
                    }
                    if(add){
                        obj.modifications.unshift(changes);
                    }
                }
                if(add){
                    obj.modelObjName = val.name;    
                    saveAndPublish(obj);
                }        
            });
        }else{
            saveAndPublish(obj);
        }
    }
};

module.exports = {
	after: function(Model,val,action){
		console.log('after: ' + Model.tableName);
		console.log('after2: ' + val.id);
		if(val.req && val.req.userId){
			console.log('after enter');
			notification(action,Model,val);
			val.req = {};
			/*Model.update({id:val.id},val).exec(function(err,model){
				if(err) throw err;
			});*/
		}
	}
	,before:function(val,action){
		//console.log(val);
		if(val.req && val.req.user){
			console.log('before: ' + val.id);
			var req = {
				userId:val.req.user.id
				,companyId:val.req.session.select_company || val.req.user.select_company
				,app: val.req.options.controller
			}
			if(val.name)
				req.modelObjName = val.name
			else
				req.modelObjName = "test";
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
	console.log('saveAndPublish');
    Notice.create(obj).exec(function(err,notice){
        if(err) throw err;
        //sails.io.sockets.in('notices').emit('update',{data:true});
        Notice.publishCreate({id:notice.id})
    });
}
