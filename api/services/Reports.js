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
		,'transfer_gral': true
		,'totalsReport': true
	};
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
	Reporte general de ventas liquidadas
*/
module.exports.transfer_gral = function(fields,cb){
	var results = false;
	Reservation.count(function(c_err,num){
		if(c_err) cb(results , c_err);
		fields.reservation_type = 'transfer';
		Reservation.find(fields).limit(num).sort('transfer').sort('startDate DESC')
		.populate('transfer').populate('company')
		.exec(function(r_err,reservations){
			if(r_err) cb(results,r_err);
			results = {
				headers : [ 
					{ label : 'Servicio' , handle : 'transfer' }
					,{ label : 'Pax' , handle : 'pax' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi' }
					,{ label : 'IVA' , handle : 'iva' }
					,{ label : 'Ventas netas' , handle : 'vn' }
				]
				,title : 'Ventas generales de Traslados'
				,rows : {}
				,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
			}
			for(var x in reservations){
				if( typeof results.rows[ reservations[x].transfer.id ] == 'undefined' )
					results.rows[ reservations[x].transfer.id ] = { transfer : reservations[x].transfer.name , pax : 0 , vsi : 0 , iva : 0 , vn : 0 };
				//Aquí se iran calculando/guardando los totales 
				var fee = reservations[x].fee;//(reservations[x].pax*reservations[x].fee_adults || 0) + (reservations[x].kidPax*reservations[x].fee_kids || 0);
				results.rows[ reservations[x].transfer.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ reservations[x].transfer.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ reservations[x].transfer.id ].iva += fee * mainIVA; //total de iva
				results.rows[ reservations[x].transfer.id ].vn += fee; //total ventas netas

				results.totals.total += fee;
				results.totals.subtotal += fee - (fee * mainIVA);
				results.totals.iva += fee * mainIVA;
				results.totals.pax += (reservations[x].pax||0) + (reservations[x].kidPax||0);
			}
			results.reportType = '';
			cb(results,false);
		});
	});
}
/* 
	Genera un reporte general de los tours vendidos, recibe:
		- fields : filtro de reservas, object
		- cb 	 : callback, function
 */
module.exports.tours_gral = function(fields,cb){
	var results = false;
	Reservation.count(function(c_err,num){
		if(c_err) cb(results , c_err);
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
			results.reportType = '';
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
			results.reportType = '';
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
					results.rows[ '0_' + reservations[x].user.id ] = { user : reservations[x].user.name , tour : '' , pax : 0 , vsi : 0 , iva : 0 , vn : 0 , type : 'c' , cm : 0 , rows2 : {} };
				if( typeof results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ] == 'undefined' )
					results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ] = { user : '' , tour : reservations[x].tour.name , pax : 0 , vsi : 0 , iva : 0 , vn : 0 , cm: 0 }
				//Aquí se iran calculando/guardando los totales 
				var fee = (reservations[x].pax*reservations[x].fee_adults || 0) + (reservations[x].kidPax*reservations[x].fee_kids || 0);
				var base_fee = (reservations[x].pax*reservations[x].fee_adults_base || 0) + (reservations[x].kidPax*reservations[x].fee_kids_base || 0);
				results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ '0_' + reservations[x].user.id ].pax += (reservations[x].pax||0) + (reservations[x].kidPax||0); // total de pax
				results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ '0_' + reservations[x].user.id ].vsi += fee - (fee * mainIVA); //total ventas sin iva
				results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ].iva += fee * mainIVA; //total de iva
				results.rows[ '0_' + reservations[x].user.id ].iva += fee * mainIVA; //total de iva
				results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ].vn += fee; //total ventas netas commission_sales
				results.rows[ '0_' + reservations[x].user.id ].vn += fee; //total ventas netas
				results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ].cm += (parseFloat(reservations[x].commission_sales)/100) * base_fee; //total comisión por tour
				results.rows[ '0_' + reservations[x].user.id ].cm += (parseFloat(reservations[x].commission_sales)/100) * base_fee; //total comisión por tour
				console.log( base_fee );
				console.log( reservations[x].commission_sales );

				results.totals.total += fee;
				results.totals.subtotal += fee - (fee * mainIVA);
				results.totals.iva += fee * mainIVA;
				results.totals.pax += (reservations[x].pax||0) + (reservations[x].kidPax||0);
			}
			results.reportType = 'bygroup';
			cb(results,false);
		});//Reservation END
	});//Reservation count END
}
/*
	Options debe de recibir:
	- sDate 	: start date 
	- eDate 	: end date
	- company	: company to filter
	- dateType 	: 1=use creation date, 2=use reservation date
	- type 		: 1=listing, 2=totals, 3=both
*/
var moment = require('moment-timezone');
module.exports.totalsReport = function(options,theCB){
	var name = 'MKP report -' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
	options.dateType = '1';
	options.sDate = new Date("October 13, 2014")
	options.eDate = new Date("October 13, 2015")
	var $match = {
		/*state : 'liquidated',
		$and : [
			{ notes : { '$ne' : 'no reservar' } }
			,{ notes : { '$ne' : 'no-reservar' } } 
		]
		,company : sails.models['company'].mongo.objectId('55b120357c4a37ed13757e43')*/
	};
	if( options.dateType == '1' ){
		//$match.$and.push({ createdAt : { '$gte' : options.sDate } });
		//$match.$and.push({ createdAt : { '$lte' : options.eDate } });
	}else{
		$match.$and.push({ createdAt : { '$gte' : options.sDate } });
		$match.$and.push({ departure_date : { '$lte' : options.eDate } });
	}
	console.log($match);
	//agregarlo los _id para poder agreguparlo bien
	var $groupGral = {
		total : { $add : [ '$fee' , '$feeKids' ] }
		,count : { $sum : 1 }
		,pax : { $sum : '$pax' }
		,kidPax : { $sum : '$kidPax' }
		,cupon : { $push : '$cupon' }
		,hotel : { $push : '$hotel' }
	};
	console.log($groupGral);
	var $groupForPopulate = {
		_id : null
		,hotels : { $push : '$hotel' }
		,cupons : { $push : '$cupon' }
	};
	Reservation.find( $match ).populate('currency').populate('transfer').populate('airport')
	.exec(function(r_err,list_reservations){
		if(r_err) theCB(false,r_err);
		Reservation.native(function(err,theReservation){
			if( err ) theCB(false,err);
			var reads = [
				function( cb ){
					$groupGral._id = '$currency'; //montos globales
					theReservation.aggregate([ 
						{ $sort : { createdAt : -1 } }, 
						{ $match : $match }, 
						{ $group : $groupGral } ],
						function(err,resultsGlobal){ 
							console.log(resultsGlobal); 
							cb(err,resultsGlobal); 
						});
				},function( resultsGlobal , cb ){
					$groupGral._id = { currency : '$currency' , reservation_method : '$reservation_method' };
					theReservation.aggregate([ { $sort : { createdAt : -1 } }, { $match : $match }, { $group : $groupGral } ],function(err,resultsByMethod){ cb(err,resultsGlobal,resultsByMethod); });
				},function( resultsGlobal, resultsByMethod, cb ){
					$groupGral._id = { currency : '$currency' , reservation_method : '$reservation_method' , payment_method : '$payment_method' };
					theReservation.aggregate([ { $sort : { createdAt : -1 } }, { $match : $match }, { $group : $groupGral } ],function(err,resultsBypayment){ cb(err,resultsGlobal,resultsByMethod,resultsBypayment); });
				},function( resultsGlobal, resultsByMethod, resultsBypayment, cb ){
					theReservation.aggregate([ { $match : $match }, { $group : $groupForPopulate } ],function(err,resultsForPopulate){ cb(err,resultsGlobal,resultsByMethod,resultsBypayment,resultsForPopulate); });
				},function( resultsGlobal, resultsByMethod, resultsBypayment, resultsForPopulate, cb ){
					var resultsPopulated = { hotels : [] , cupons : [] };
					Hotels.find().where({ id : { '$in' : resultsForPopulate.hotels } }).populate('zone').exec(function(err,hotels){
						if(err) theCB(false,err);
						CuponSingle.find().where({ id : { '$in' : resultsForPopulate.cupons } }).populate('cupon').exec(function(err,cupons){
							if(err) theCB(false,err);
							resultsPopulated.hotels = hotels;
							resultsPopulated.cupons = cupons;
							cb(err,resultsGlobal,resultsByMethod,resultsBypayment,resultsForPopulate,resultsPopulated);
						});
					});
				}
			];//reads END
			async.waterfall(reads,function(err,resultsGlobal,resultsByMethod,resultsBypayment,resultsForPopulate,resultsPopulated){
				console.log('results');
				console.log(resultsGlobal);
				console.log(resultsByMethod);
				console.log(resultsBypayment);
				console.log(resultsForPopulate);
				var toCSV = [];
				toCSV.push(['referencia', 'Pax', 'Total web', 'Descuento', 'Cupón', 'Precio yellow', 'Precio agencia', 'Diferencia yellow/agencia', 'Agencia diferencia', 'Comisión', 'Precio neto', 'Moneda', 'Region', 'Amount of Services', 'Service type', 'Metodo de pago', 'Airport', 'Servicio', 'Reservation Date', 'Status', 'Servicio completado'])
				if( list_reservations ){ for( var x in list_reservations ){
					var l = list_reservations[x];
					var i = 0;
					var item = [];
					var cupon = getItemById( l.cupon, resultsPopulated.cupons );
					item[i] = l.folio;
					item[++i] = l.pax;
					item[++i] = l.fee + l.feeKids;
					item[++i] = l.type=='round_trip'?cupon.cupon.round_discount:cupon.cupon.simple_discount;//descuento
					item[++i] = cupon.token;//cupón
					item[++i] = 0;//precio yellow
					item[++i] = 0;//precio agencia
					item[++i] = 0;//diferencia yellow/agencia
					item[++i] = 0;//diferencia agencia
					item[++i] = l.commission_agency;//comisión
					item[++i] = l.commission_agency ? l.fee - ( l.fee * l.commission_agency ) : l.fee;//precio neto?
					item[++i] = l.currency.currency_code;
					item[++i] = getItemById(l.hotel,resultsPopulated.hotels).zone.name;
					item[++i] = l.quantity;//cantidad
					item[++i] = l.type;//service type
					item[++i] = l.payment_method;
					item[++i] = l.airport.name;
					item[++i] = l.transfer.name;
					item[++i] = l.createdAt;
					item[++i] = l.state;
					item[++i] = 'completado';
					toCSV.push(item);
				} }
				theCB(toCSV,false);
			});//async waterfall END
		});
	});//reservation find END
}
var getItemById = function(id,objectArray){
	var r = false;
	if( objectArray && objectArray.length > 0 )
		for(var x in objectArray)
			if( objectArray[x].id == id )
				return objectArray[x];
	return  r;
}