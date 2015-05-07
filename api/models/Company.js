/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
    name : {
      type : 'string',
      required: true
    }
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
		,hotels : {
			collection: 'hotel',
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
                var cApps = this.apps || [];
                apps.forEach(function(app){
                    if(cApps.indexOf(app) < 0)
                        cApps.push(app);
                });
				this.apps = cApps;
				this.save(cb);
			} else {
				cb({message:'no apps'},this);
			}
		}
		,removeApp : function(app,cb){
			if (this.apps) {
				cApps = this.apps;
				for(key in this.apps){
					if(this.apps[key] == app) this.apps.splice(key,1);
				}
				this.save(cb);
			} else {
				cb(null,this);
			}
		}
	}
	,attrs_labels : {
		name : { es : 'Nombre' , en : 'Name' }
		,description : { es : 'Descripción' , en : 'Description' }
		,address : { es : 'Dirección' , en : 'Address' }
		,zipcode : { es : 'Código postal' , en : 'Zip code' }
		,base_currency : { es : 'Moneda base' , en : 'Base currency' }
		,apps : { es : 'Apps' , en : 'Apps' }
		,active : { es : 'Activo' , en : 'Active' }
		,terms : { es : 'Términos y condiciones' , en : 'Terms and conditions' }
		,footer : { es : 'Firma' , en : 'Sign' }
		,users : { es : 'Usuarios' , en : 'Users' }
	}
	,labels : {
    es : 'Empresas',
    en : 'Companies'
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

