/**
* Hotel.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
	    name : {
	      type : 'string',
	      required: true },
		phones : 'array',
		location : { model : 'location' },
		departurePlaces : 'array',
		rooms : {
			collection : 'room',
			via: 'hotel' },
		foodSchemes : {
			collection : 'foodScheme',
			via : 'hotels' },
		seasonScheme : {
			model : 'seasonScheme',
			via : 'hotels' },
		companies : {
			collection: 'company',
			via: 'hotels',
			dominant: false
		},
		company : {
			model : 'company',
      		required: true },
		zone : { model : 'zone' },
		cupons:{
			model : 'cupon',
			via : 'hotels'
        },
        transferTours : {
            collection : 'Tour',
            via : 'transferHotels'
        },
        visible : {
            type : 'string',
            enum : ['yes','no'],
            defaultsTo : 'yes'
        }
	}
	,attrs_labels : {
		name : { es : 'Nombre' , en : 'Nombre' }
		,address : { es : 'Dirección' , en : 'Address' }
		,location : { es : 'Ciudad' , en : 'City' }
		,zone : { es : 'Zona' , en : 'Zone' }
		,phones : { es : 'Teléfonos' , en : 'Phones' }
		,seasonScheme : { es : 'Esquema de temporadas' , en : 'Seasons scheme' }
		,foodSchemes : { es : 'Esquema de alimentación' , en : 'Food scheme' }
		,description_es : { es : 'Descripción Español' , en : 'Spanish Description' }
		,description_en : { es : 'Descripción Inglés' , en : 'English Description' }
		,description_ru : { es : 'Descripción Ruso' , en : 'Russian Description' }
		,description_pt : { es : 'Descripción Portugués' , en : 'Portuguese Description' }
		,services_es : { es : 'Servicios Español' , en : 'Spanish Services' }
		,services_en : { es : 'Servicios Inglés' , en : 'English Services' }
		,services_ru : { es : 'Servicios Ruso' , en : 'Russian Services' }
		,services_pt : { es : 'Servicios Portugués' , en : 'Portuguese Services' }
		,payed_services_es : { es : 'Servicios pagados Español' , en : 'Spanish Payed services' }
		,payed_services_en : { es : 'Servicios pagados Inglés' , en : 'English Payed services' }
		,payed_services_ru : { es : 'Servicios pagados Ruso' , en : 'Russian Payed services' }
		,payed_services_pt : { es : 'Servicios pagados Portugués' , en : 'Portuguese Payed services' }
		,rooms : { es : 'Cuartos' , en : 'Rooms' }
		,latitude : { es : 'Coordenadas (Latitud)' , en : 'Coordinates (Latitude)' }
		,longitude : { es : 'Coordenadas (Longitud)' , en : 'Coordinates (Longitud)' }
	}
	,labels : {
		es : 'Hoteles',
		en : 'Hotels'
	}
  	,afterCreate: function(val,cb){
		Notifications.after(Hotel,val,'create');
		cb()
	},afterUpdate: function(val,cb){
		//console.log('update hotel');
		Notifications.after(Hotel,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

