/*
	Este servicio generará todos los reportes
	Se separará cada uno de los reportes en funciones, las dejaré públicas
	para que se pueda accederse a cada una por separado.
	También estará "getReport" para obtener pasar el id del reporte
	Recibe como parámetros : 
		- type 		: identificador de reporte, string
		- fields 	: campos que filtran el reporte, object
		- user 		: usuario para checar permisos, User type object
		- cb 		: callback, function
*/
var mainIVA = .15;
module.exports.getReport = function(type,fields,cb){
	var reports_available = {
		'tours_gral' : true
		,'tours_by_agency': true
		,'tours_by_user': true
	};
	//console.log('type:');console.log(reports_available[type]);
	if( typeof reports_available[type] != 'undefined' ){
		var results = {};
		var errors = false;
		//cb(results , errors);
		Reports[type](fields,cb);
	}else{
		cb(false,'Undefined report');
	}
};
/* 
	Genera un reporte general de los tours vendidos, recibe:
		- fields : filtro de reservas, object
		- cb 	 : callback, function
 */
module.exports.tours_gral = function(fields,cb){
	var results = false;
	Reservation.count(function(c_err,num){
		if(c_err){ console.log(c_err); cb(results , c_err); };
		fields.reservation_type = 'tour';
		Reservation.find(fields).limit(num).sort('tour').sort('startDate DESC')
		.populate('tour').populate('company')
		.exec(function(r_err,reservations){
			if(r_err){ console.log(r_err); cb(results , r_err); };
			results = {
				headers : [ 
					{ label : 'Tour' , handle : 'tour' }
					,{ label : 'Pax' , handle : 'pax' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi' }
					,{ label : 'IVA' , handle : 'iva' }
					,{ label : 'Ventas netas' , handle : 'vn' }
				]
				,title : 'Ventas generales de Tours'
				,rows : {}
				,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
			}
			for(var x in reservations){
				if( typeof results.rows[ reservations[x].tour.id ] == 'undefined' )
					results.rows[ reservations[x].tour.id ] = { tour : reservations[x].tour.name , pax : 0 , vsi : 0 , iva : 0 , vn : 0 };
				//Aquí se iran calculando/guardando los totales 
				var fee = (reservations[x].pax*reservations[x].fee_adults || 0) + (reservations[x].kidPax*reservations[x].fee_kids || 0);
				results.rows[ reservations[x].tour.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ reservations[x].tour.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ reservations[x].tour.id ].iva += fee * mainIVA; //total de iva
				results.rows[ reservations[x].tour.id ].vn += fee; //total ventas netas

				results.totals.total += fee;
				results.totals.subtotal += fee - (fee * mainIVA);
				results.totals.iva += fee * mainIVA;
				results.totals.pax += (reservations[x].pax||0) + (reservations[x].kidPax||0);
			}
			cb(results,false);
		});//Reservation END
	});//Reservation count END
}
module.exports.tours_by_agency = function(fields,cb){
	var results = false;
	Reservation.count(function(c_err,num){
		if(c_err){ console.log(c_err); cb(results , c_err); };
		fields.reservation_type = 'tour';
		Reservation.find(fields).limit(num).sort('tour').sort('startDate DESC')
		.populate('tour').populate('company')
		.exec(function(r_err,reservations){
			if(r_err){ console.log(r_err); cb(results , r_err); };
			results = {
				headers : [ 
					{ label : 'Agencia' , handle : 'company' }
					,{ label : 'Tour' , handle : 'tour' }
					,{ label : 'Pax' , handle : 'pax' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi' }
					,{ label : 'IVA' , handle : 'iva' }
					,{ label : 'Ventas netas' , handle : 'vn' }
				]
				,title : 'Ventas generales de Tours por Agencia'
				,rows : {}
				,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
			}
			for(var x in reservations){
				if( typeof results.rows[ '0_' + reservations[x].company.id ] == 'undefined' ) 
					results.rows[ '0_' + reservations[x].company.id ] = { company : reservations[x].company.name , tour : '' , pax : 0 , vsi : 0 , iva : 0 , vn : 0 , type : 'c' };
				if( typeof results.rows[ reservations[x].tour.id ] == 'undefined' )
					results.rows[ reservations[x].tour.id ] = { company : '' , tour : reservations[x].tour.name , pax : 0 , vsi : 0 , iva : 0 , vn : 0 }
				//Aquí se iran calculando/guardando los totales 
				var fee = (reservations[x].pax*reservations[x].fee_adults || 0) + (reservations[x].kidPax*reservations[x].fee_kids || 0);
				results.rows[ reservations[x].tour.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ '0_' + reservations[x].company.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ reservations[x].tour.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ '0_' + reservations[x].company.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ reservations[x].tour.id ].iva += fee * mainIVA; //total de iva
				results.rows[ '0_' + reservations[x].company.id ].iva += fee * mainIVA; //total de iva
				results.rows[ reservations[x].tour.id ].vn += fee; //total ventas netas
				results.rows[ '0_' + reservations[x].company.id ].vn += fee; //total ventas netas

				results.totals.total += fee;
				results.totals.subtotal += fee - (fee * mainIVA);
				results.totals.iva += fee * mainIVA;
				results.totals.pax += (reservations[x].pax||0) + (reservations[x].kidPax||0);
			}
			cb(results,false);
		});//Reservation END
	});//Reservation count END
}
module.exports.tours_by_user = function(fields,cb){
	var results = false;
	Reservation.count(function(c_err,num){
		if(c_err){ console.log(c_err); cb(results , c_err); };
		fields.reservation_type = 'tour';
		Reservation.find(fields).limit(num).sort('tour').sort('startDate DESC')
		.populate('tour').populate('user')
		.exec(function(r_err,reservations){
			if(r_err){ console.log(r_err); cb(results , r_err); };
			results = {
				headers : [ 
					{ label : 'Usuario' , handle : 'user' }
					,{ label : 'Tour' , handle : 'tour' }
					,{ label : 'Pax' , handle : 'pax' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi' }
					,{ label : 'IVA' , handle : 'iva' }
					,{ label : 'Ventas netas' , handle : 'vn' }
					,{ label : 'Comisión' , handle : 'cm' }
				]
				,title : 'Ventas generales de Tours por Usuario'
				,rows : {}
				,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
			}
			for(var x in reservations){
				if( typeof results.rows[ '0_' + reservations[x].user.id ] == 'undefined' ) 
					results.rows[ '0_' + reservations[x].user.id ] = { user : reservations[x].user.name , tour : '' , pax : 0 , vsi : 0 , iva : 0 , vn : 0 , type : 'c' };
				if( typeof results.rows[ reservations[x].tour.id ] == 'undefined' )
					results.rows[ reservations[x].tour.id ] = { user : '' , tour : reservations[x].tour.name , pax : 0 , vsi : 0 , iva : 0 , vn : 0 }
				//Aquí se iran calculando/guardando los totales 
				var fee = (reservations[x].pax*reservations[x].fee_adults || 0) + (reservations[x].kidPax*reservations[x].fee_kids || 0);
				results.rows[ reservations[x].tour.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ '0_' + reservations[x].user.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ reservations[x].tour.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ '0_' + reservations[x].user.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ reservations[x].tour.id ].iva += fee * mainIVA; //total de iva
				results.rows[ '0_' + reservations[x].user.id ].iva += fee * mainIVA; //total de iva
				results.rows[ reservations[x].tour.id ].vn += fee; //total ventas netas
				results.rows[ '0_' + reservations[x].user.id ].vn += fee; //total ventas netas
				results.rows[ reservations[x].tour.id ].cm += (parseFloat(reservations[x].tour.commission_sales)/100) *fee; //total comisión por tour
				results.rows[ '0_' + reservations[x].user.id ].cm += (parseFloat(reservations[x].tour.commission_sales)/100) *fee; //total comisión por tour

				results.totals.total += fee;
				results.totals.subtotal += fee - (fee * mainIVA);
				results.totals.iva += fee * mainIVA;
				results.totals.pax += (reservations[x].pax||0) + (reservations[x].kidPax||0);
			}
			cb(results,false);
		});//Reservation END
	});//Reservation count END
}