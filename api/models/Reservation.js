/**
* Reservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
/* campos default : _id, createdAt, updatedAt	
        fee : 'float',
		state : {
		    type:'string',
		    enum : ['pending','liquidated','canceled']
		}
		,payment_method : { type:'string', enum : ['creditcard','paypal','cash'] }
		,origin : { type:'string', enum : ['hotel','airport'] }
		,type : { type:'string', enum : ['round_trip','one_way'] }
		,reservation_type : { type:'string', enum : ['tour','hotel','transfer'] }
		,pax : 'integer'
		,arrival_date : 'date'
*/
module.exports = {
	attributes: {
		user : {
			model : 'user' }
		,company : {
			model : 'company' }
		,order : {
			model : 'order', }
		,client : {
			model : 'client_' }
		,airport : {
			model : 'airport' }
		,tour : {
			model : 'tour' }
		,hotel : {
			model : 'hotel' }
		,transfer : {
			model : 'transfer' }
        ,transferprice : {
            model : 'transferprice' }
        ,state : {
            type:'string',
            enum : ['pending','liquidated','canceled']
        }
        ,payment_method : {
            type:'string',
            enum : ['creditcard','paypal','cash']
        }
        ,origin : {
            type:'string',
            enum : ['hotel','airport']
        }
        ,type : {
            type:'string',
            enum : ['round_trip','one_way']
        }
        ,reservation_type : {
            type:'string',
            enum : ['tour','hotel','transfer']
        }

        ,fee : {
            type : 'float',
            required : true
        }//total

        ,fee_kids : 'float'
        ,fee_kids_rt : 'float'
        ,fee_adults : 'float'
        ,fee_adults_rt : 'float'
        ,fee_special : 'float'

        ,coupon : {
            model : 'CuponSingle'
        }

        ,pax : 'integer'
        ,kidPax : 'integer'

        ,arrival_date : 'date'
        ,arrival_fly : 'string'
        ,arrival_time : 'datetime'
        ,arrivalpickup_time : 'datetime'
        ,departure_date : 'date'
        ,departure_fly : 'string'
        ,departure_time : 'datetime'
        ,departurepickup_time : 'datetime'
        ,startDate : 'date'
        ,endDate : 'date'
        ,autorization_code : 'string'

        //hotel
        ,roomType : {
            model : 'RoomType'
        }
        ,roomsNumber : 'integer'
        //news
        ,departure_airline : 'string'
        ,arrival_airline : 'string'
        ,room : 'string' //cuarto en el que se está quedando el cliente, para las reservas de traslados es informativo
        ,currency : {
        	model : 'currency'
        }
        ,service_type : {
            type:'string',
            enum : ['C','P','D'] //c=colectivo , p=privado , d=directo
        }
        ,reservation_status : {
            type:'string',
            enum : ['C','N','M'] //c=cancelado , p=nuevo , d=modificado
        }
        ,transfer_type : {
            type:'string',
            enum : ['1','2'] //1=hotel-hotel , 2=aeropuerto-hotel
        }
        /*
        	Objeto que va a contener los tipos de cambio y las comisiones
            - commission_who : 'string' // para quién es la comisión ['agency','user']
        	- commission_who_value : 'integer' // monto que se llevará
            - exchange_rate_agency : 'integer' //tipo cambio agencia
            - exchange_rate_book : 'integer' //tipo cambio contable
            - exchange_rate_sale : 'integer' //tipo cambio de venta
        	- provider_payment : 'integer' //cuánto se pagará al proveedor
        */
        ,books : 'json'

	}
	, attrs_labels : {
		//transfer reservations
		hotel : { es : 'Hotel' , en : 'Hotel' }
		,airport : { es : 'Aeropuerto' , en : 'Airport' }
		,fee : { es : 'Precio' , en : 'Price' }
		,transfer : { es : 'Servicio' , en : 'Service' }
		,autorization_code : { es : 'Código de autorización' , en : 'Autorization code' }
		,state : { es : 'Estado de pago' , en : 'Payment state' }
		,payment_method : { es : 'Método de pago' , en : 'Payment method' }
		,pax : { es : 'Personas' , en : 'People' }
		,origin : { es : 'Origen' , en : 'Origin' }
		,type : { es : 'Tipo de viaje' , en : 'Travel type' }
		,arrival_date : { es : 'Fecha de llegada' , en : 'Arrival date' }
		,arrival_fly : { es : 'Vuelo de llegada' , en : 'Arrival fly' }
		,arrival_time : { es : 'Hora de llegada' , en : 'Arrival time' }
		,arrivalpickup_time : { es : 'Llegada (Pickup time)' , en : 'Arrival pickup time' }
		,client : { es : 'Cliente' , en : 'Client' }
		,departure_date : { es : 'Fecha de salida' , en : 'Departure date' }
		,departure_fly : { es : 'Vuelo de salida' , en : 'Departure fly' }
		,departure_time : { es : 'Hora de salida' , en : 'Departure time' }
		,departurepickup_time : { es : 'Salida (pickupt time)' , en : 'Departure pickup time' }
		//tour and hotel reservation
		,kidsPax : { es : 'Número de niños' , en : 'Children number' }
		,startDate : { es : 'Fecha de llegada' , en : 'Arrival date' }
		,endDate : { es : 'Fecha de salida' , en : 'Departure date' }
        //hotel reservation
		,roomType : { es : 'Tipo de cuarto' , en : 'Room type' }
		,roomsNumber : { es : 'Número de cuartos' , en : 'Rooms number' }
        ,fee_special : { es : 'Precio especial' , en : 'Special fee' }
	}
	,migrate : "safe"
	,labels : {
        es : 'Reservaciones'
        ,en : 'Reservations'
    }
	,afterCreate: function(val,cb){
		Notifications.after(Reservation,val,'create');
		cb();
	},afterUpdate: function(val,cb){
		console.log('afterUpdate: reservation');
		//Notifications.after(Reservation,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		console.log('beforeUpdate reservation');
		//Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		//Notifications.before(val);cb();
		cb();
	}
}