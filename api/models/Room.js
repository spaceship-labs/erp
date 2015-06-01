/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {	
		hotel : { model : 'hotel' },
		views : {
			collection : 'hotelRoomView',
			via : 'rooms'
		},
		fees : 'json'
		,fee : 'decimal' // precio de venta
		,feeChild : 'decimal' //precio de venta
		,fee_base : 'decimal' //precios de proveedor
		,fee_child_base : 'decimal' //precios de proveedor
		,agencies : {
			collection : 'companyproduct'
			, via : 'room'
		}
	}
	, attrs_labels : {
		name_es : { es : 'Nombre' , en : 'Name' }
		,name_en : { es : 'Nombre inglés' , en : 'English name' }
		,name_ru : { es : 'Nombre ruso' , en : 'Russian name' }
		,name_pt : { es : 'Nombre portugués' , en : 'Portuguese name' }
		,description_es : { es : 'Descripción español' , en : 'Spanish description' }
		,description_en : { es : 'Descripción inglés' , en : 'English description' }
		,description_ru : { es : 'Descripción ruso' , en : 'Russian description' }
		,description_pt : { es : 'Descripción portugués' , en : 'Portuguese description' }
		,services_es : { es : 'Servicios español' , en : 'Spanish services' }
		,services_en : { es : 'Servicios inglés' , en : 'English services' }
		,services_ru : { es : 'Servicios ruso' , en : 'Russian services' }
		,services_pt : { es : 'Servicios portugués' , en : 'Portuguese services' }
		,fee : { es : 'Precio base'  , en : 'Base rate' }
		,fees : { es : 'Precios por temporadas' , en : 'Rates per season' }
		,active : { es : 'Activo' , en : 'Active' }
		,pax : { es : 'Personas' , en : 'People' }
		,views : { es : 'Vistas' , en : 'Views' }
		,seasonal : { es : 'Usar tarifas por temporada' , en : 'Use season rates' }
	}
  	,migrate : "safe"
	,labels : {
        es : 'Cuartos'
        ,en : 'Rooms'
    }
  	,afterCreate: function(val,cb){
		Notifications.after(Room,val,'create');
		cb()
	}
	,afterUpdate: function(val,cb){
		console.log('afterUpdate: room');
		Notifications.after(Room,val,'update');
		cb();
	}
	,beforeUpdate:function(val,cb){
		console.log('beforeUpdate: room');
		Notifications.before(val);
		cb();
	}
	,beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

