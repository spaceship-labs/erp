/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name:'string'
		,icon:'json'
		,description:'string'
		,address:'string'
		,zipcode:'string'
		,app:'array'
		,base_currency:{
			model : 'currency'
		}
		,currency_comission:'float'
		,currencies:{
			collection : 'currency',
			via : 'companies',
			dominant : true
		}
		,active: 'boolean'
		,users : {
			collection: 'user',
			via: 'companies',
			dominant: true
		}
		,apps : 'array'
        ,terms : 'string'
        ,document_footer : 'string'
        ,taxes : {
            collection : 'Company_tax',
            via : 'company'
        }
		,addApps : function(apps,cb){		
			if(Array.isArray(apps)){
				//if(this.apps){
					var cApps = this.apps || [];
					apps.forEach(function(app){
						if(cApps.indexOf(app) < 0) 
							cApps.push(app);
					});
				//}
				this.apps = cApps;
				this.save(cb);
			}else{
				cb({message:'no apps'},this);
			}
		}
		,removeApp : function(app,cb){
			if(this.apps){
				cApps = this.apps;
				for(key in this.apps){
					if(this.apps[key] == app) this.apps.splice(key,1);
				}
				this.save(cb);
			}else{
				cb(null,this);
			}
		}

	}
	
	,afterCreate: function(val,cb){
		Notifications.after(Company,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Company,val,'update');
		cb();
	}
	,beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	}
	,beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

