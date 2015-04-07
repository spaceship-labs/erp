/**
* PackageTour.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name : 'string',
		company : {
			model : 'company'
		},
		user : {
			model : 'user'
		},
		items : {
			collection : 'packageitem',
			via : 'package_'
		}
	}
	, attrs_labels : {
		name : { es : 'Nombre español' , en : 'Spanish name' }
		,name_es : { es : 'Nombre inglés' , en : 'English name' }
		,name_ru : { es : 'Nombre ruso' , en : 'Russian Name' }
		,name_pt : { es : 'Nombre portugués' , en : 'Portuguese name' }
		,description_es : { es : 'Descripción español' , en : 'Spanish description' }
		,description_en : { es : 'Descripción inglés' , en : 'English description' }
		,description_ru : { es : 'Descripción ruso' , en : 'Russian description' }
		,description_pt : { es : 'Descripción portugués' , en : 'Portuguese description' }
		,services_es : { es : 'Servicios español' , en : 'Spanish services' }
		,services_en : { es : 'Servicios inglés' , en : 'English services' }
		,services_ru : { es : 'Servicios ruso' , en : 'Russian services' }
		,services_pt : { es : 'Servicios portugués' , en : 'Portuguese services' }
		,visible : { es : 'Visible en web' , en : 'Visible on web' }
	}
	,labels : {
        es : 'Paquetes'
        ,en : 'Packages'
    }
  	,afterCreate: function(val,cb){
		Notifications.after(PackageTour,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		Notifications.after(PackageTour,val,'update');
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

