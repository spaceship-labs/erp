/*
	Notas Generales de los reportes
		- En todos los reportes se deben de obtener las reservas liquidadas y las canceladas para poder calcular las devoluciones
		- Definir el IVA en la empresa principal!!
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
		,'tours_by_hotel': true
		,'tours_by_user': true
		,'tours_by_provider': true
		,'tours_by_payment_method': true
		,'totalsReport': true
		,'logisticsReport': true
		,'tours_by_user_list': true
		,'tours_by_provider_list': true
		,'tours_by_agency_list': true
		,'tours_by_hotel_list': true
		,'tours_by_payment_method_list': true
		,'tours_cupon_by_user': true
		,'tours_commision_by_cupon': true
		,'transfer_gral': true
		,'transfer_by_service' : true
		,'transfer_by_agency' : true
		,'transfer_by_provider' : true
		,'fees_report_transfers_by_agency' : true
	};
	if( typeof reports_available[type] != 'undefined' ){
		//console.log('FIELDS 2:',fields);
		Reports[type](fields,cb);
	}else{
		cb(false,'Undefined report');
	}
};
/*
	Reporte general de ventas liquidadas
*/
var formatFields = function(fields){
	for( x in fields )
		if( x == 'hotel' || x == 'company' || x == 'transfer' )
			fields[x] += "";
	return fields;
}
module.exports.transfer_gral = function(fields,cb){ //filters OK
	var results = false;
	Reservation.count(function(c_err,num){
		if(c_err) cb(results , c_err);
		fields = formatFields(fields);
		fields.reservation_type = 'transfer';
		if(!fields.state) fields.state = 'liquidated';
		Reservation.find(fields).limit(num).sort('transfer').sort('startDate DESC')
		.populate('transfer').populate('company')
		.exec(function(r_err,reservations){
			if(r_err) return cb(results,r_err);
			results = {
				headers : [ 
					{ label : 'Servicio' , handle : 'transfer', type : '' }
					,{ label : 'Pax' , handle : 'pax', type : '' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi', type : 'currency' }
					,{ label : 'IVA' , handle : 'iva', type : 'currency' }
					,{ label : 'Ventas netas' , handle : 'vn', type : 'currency' }
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
	Reporte de ventas de Traslador por Agencia
		resultsGlobal -> tiene los totales de todo
		resultsCompany -> tiene los totales por compañia
*/
module.exports.transfer_by_agency = function(fields,cb){ //filters OK
	var results = {
		headers : [ 
			{ label : 'Agencia' , handle : 'name', object : '_id', object2:'_id' , type : '' }
			,{ label : 'Folio' , handle : 'folio', type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Total' , handle : 'total', type : 'currency' }
			,{ label : 'Comisión' , handle : 'comision', type : 'currency' }
			,{ label : 'Servicio' , handle : 'name', object : 'transfer', object2:'transfer' , type : '' }
			,{ label : 'Fecha de reservación' , handle : 'createdAt' , type : '' }
			,{ label : 'Llegada' , handle : 'arrivalDate' , type : '' }
			,{ label : 'Salida' , handle : 'departureDate' , type : '' }
			,{ label : 'Hotel' , handle : 'name', object : 'hotel', object2: 'hotel' , type : '' }
			,{ label : 'FolioAgencia' , handle : 'folioAgency' , type : '' }
		]
		,title : 'Reporte de Reservas por Agencia'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	};
	var $match = fields || {};
	$match.reservation_type = 'transfer';
	if(!$match.state) $match.state = 'liquidated';
	var $groupGral = {
		_id : null
		,companyIDs : { '$push' : '$company' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupCompany = {
		_id : null
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	var $projectGral = {
		company:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1,hotel:1
		,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
		,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
	};
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : $projectGral }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if(err) return cb(false,err);
			resultsGlobal = resultsGlobal[0];
			if( !resultsGlobal.companyIDs )  return cb(false,{ err: 'no results' });
			var companyIDs = _.map(resultsGlobal.companyIDs, function(x){ return x.toString(); });
			companyIDs = _.uniq(companyIDs);
			async.mapSeries( companyIDs, function(item,theCB){
				$match.company = sails.models['company'].mongo.objectId( item );
				theReservation.aggregate([ 
					{ $sort : { createdAt : -1 } }, { $match : $match }
					,{ $project : $projectGral }
					,{ $group : $groupGral } 
				],function(err,resultsCompany){ 
					resultsCompany = resultsCompany[0];
					$match = formatFields($match);
					$match.company = [item];
					//console.log('MATCH STRING',$match);
					Reservation.find().where( $match ) //fields && { company : [item] , reservation_type : 'transfer' }
					.populate('company').populate('asign').populate('transfer').populate('hotel')
					.exec(function(r_err,reservations){
						//console.log(reservations.length);
						if(err||reservations.length==0) return theCB(err,false);
						var aux = {
							_id : reservations[0].company
							,pax : resultsCompany.pax
							,total : resultsCompany.total
							,comision : resultsCompany.total * ( reservations[0].company.comision?(reservations[0].company.comision/100) : .08 )
							,rows2 : []
							,company : reservations[0].company
						};
						for(var x in reservations){
							var type = reservations[x].type
							aux.rows2.push({
								_id : {}
								,folio : reservations[x].folio
								,pax : reservations[x].pax + ( reservations[x].kidPax || 0 )
								,total : reservations[x].fee + ( reservations[x].feeKids || 0 )
								,transfer : reservations[x].transfer
								,createdAt : moment(reservations[x].createdAt).format('D-MM-YYYY')
								,arrivalDate : (reservations[x].arrival_date?moment(reservations[x].arrival_date).format('D-MM-YYYY'):'')
								,departureDate : (reservations[x].departure_date?moment(reservations[x].departure_date).format('D-MM-YYYY'):'')
								,hotel : reservations[x].hotel
								,folioAgency : reservations[x].folioAgency
							});
						}
						theCB(false,aux);
					});
				});//aggregate by company
			},function(err,items){
				//agregar los resultados
				results.rows = items;
				results.totals.total = resultsGlobal.total;
				results.totals.iva = resultsGlobal.total*mainIVA;
				results.totals.subtotal = resultsGlobal.total - results.totals.iva;
				results.totals.pax = resultsGlobal.pax;
				//var comision = items[0]&&items[0]._id.comision? items[0]._id.comision/100 : .08 ;
				//results.totals.comision = results.totals.total * comision;
				results.reportType = 'bygroup';
				cb(results,err);
			});//async by companies
		});//global aggregate
	});//.native close
};
/*
	Reporte de transfers por Servicio
*/
module.exports.transfer_by_service = function(fields,cb){ //filters ok
	var results = {
		headers : [ 
			{ label : 'Servicio' , handle : 'name', object : '_id', object2:'_id' , type : '' }
			,{ label : 'Folio' , handle : 'folio', type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Total' , handle : 'total', type : 'currency' }
			,{ label : 'Agencia' , handle : 'name', object : 'company', object2:'company' , type : '' }
			,{ label : 'Fecha reservación' , handle : 'createdAt' , type : '' }
			,{ label : 'Llegada' , handle : 'arrivalDate' , type : '' }
			,{ label : 'Salida' , handle : 'departureDate' , type : '' }
			,{ label : 'Vehículo' , handle : 'car_id', object : 'vehicle', object2:'vehicle' , type : '' }
			,{ label : 'Hotel' , handle : 'name', object : 'hotel', object2: 'hotel' , type : '' }
			,{ label : 'FolioAgencia' , handle : 'folioAgency' , type : '' }
		]
		,title : 'Reporte de Reservas por Servicio'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	};
	var $match = fields || {};
	$match.reservation_type = 'transfer';
	if(!$match.state) $match.state = 'liquidated';
	var $groupGral = {
		_id : null
		,transferIDs : { '$push' : '$transfer' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupCompany = {
		_id : null
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	var $projectGral = {
		company:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1,transfer:1
		,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
		,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
	};
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : $projectGral }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if(err) return cb(false,err);
			resultsGlobal = resultsGlobal[0];
			console.log('resultsGlobal',resultsGlobal);
			var transferIDs = _.map(resultsGlobal.transferIDs, function(x){ return x.toString(); });
			transferIDs = _.uniq(transferIDs);
			async.mapSeries( transferIDs, function(item,theCB){
				$match.transfer = sails.models['transfer'].mongo.objectId( item );
				theReservation.aggregate([ 
					{ $sort : { createdAt : -1 } }, { $match : $match }
					,{ $project : $projectGral }
					,{ $group : $groupGral } 
				],function(err,resultsCompany){ 
					resultsCompany = resultsCompany[0];
					//console.log('resultsCompany',resultsCompany);
					$match = formatFields($match);
					$match.transfer = [item];
					Reservation.find( $match ) //fields && { transfer : [item] , reservation_type : 'transfer' }
					.populate('company').populate('asign').populate('transfer').populate('hotel')
					.exec(function(r_err,reservations){
						console.log(reservations.length);
						if(err||reservations.length==0) return theCB(err,false);
						var aux = {
							_id : reservations[0].transfer
							,pax : resultsCompany.pax
							,total : resultsCompany.total
							,rows2 : []
						};
						for(var x in reservations){
							var type = reservations[x].type
							aux.rows2.push({
								_id : {}
								,folio : reservations[x].folio
								,pax : reservations[x].pax + ( reservations[x].kidPax || 0 )
								,total : reservations[x].fee + ( reservations[x].feeKids || 0 )
								,company : reservations[x].company
								,createdAt : moment(reservations[x].createdAt).format('D-MM-YYYY')
								,arrivalDate : (reservations[x].arrival_date?moment(reservations[x].arrival_date).format('D-MM-YYYY'):'')
								,departureDate : (reservations[x].departure_date?moment(reservations[x].departure_date).format('D-MM-YYYY'):'')
								,hotel : reservations[x].hotel
								,folioAgency : reservations[x].folioAgency
								,vehicle : reservations[x].vehicle
							});
						}
						theCB(false,aux);
					});
				});//aggregate by company
			},function(err,items){
				//agregar los resultados
				results.rows = items;
				results.totals.total = resultsGlobal.total;
				results.totals.iva = resultsGlobal.total*mainIVA;
				results.totals.subtotal = resultsGlobal.total - results.totals.iva;
				results.totals.pax = resultsGlobal.pax;
				results.reportType = 'bygroup';
				cb(results,err);
			});//async by companies
		});//global aggregate
	});//.native close
};
module.exports.transfer_by_provider = function(fields,cb){
	var results = {
		headers : [ 
			{ label : 'Proveedor' , handle : 'name', object : '_id', object2:'_id' , type : '' }
			,{ label : 'Folio' , handle : 'folio', type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Total' , handle : 'total', type : 'currency' }
			,{ label : 'Comisión' , handle : 'comision', type : 'currency' }
			,{ label : 'Agencia' , handle : 'name', object : 'company', object2:'company' , type : '' }
			,{ label : 'Llegada' , handle : 'arrivalDate' , type : '' }
			,{ label : 'Salida' , handle : 'departureDate' , type : '' }
			,{ label : 'Hotel' , handle : 'name', object : 'hotel', object2: 'hotel' , type : '' }
			,{ label : 'FolioAgencia' , handle : 'folioAgency' , type : '' }
		]
		,title : 'Reporte de Reservas por Proveedor'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0, comision : 0 }
	};
	var $match = fields || {};
	$match.reservation_type = 'transfer';
	if(!$match.state) $match.state = 'liquidated';
	var $groupGral = {
		_id : '$company'
		,providerIDs : { '$push' : '$company' } //obtener las compañias que son los proveedores que se van a necesitar
		,reservationIDs : { '$push' : '$reservation' }
	};
	var $groupReservation = {
		_id : null
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	var $projectReservation = {
		company:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1,transfer:1,hotel:1
		,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
		,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
	};
	TransportAsign.native(function(err,theAsign){
		theAsign.aggregate([
			{ $sort : { createdAt : -1 } }, { $match : { company : {$ne: null }, reservation : {$ne: null} } }
			,{ $group : $groupGral } 
		],function(err,asignsGruoup){
			if(err || asignsGruoup.length == 0) return cb(false,err);
			//asignsGruoup contendrá un arreglo de arreglos de reservaciones ya agrupadas
			//primero tendría que obtener los companies
			console.log('asignsGruoup',asignsGruoup);
			Company.find({ id : asignsGruoup[0].providerIDs }).exec(function(err,providers){
				Reservation.native(function(err,theReservation){
					async.mapSeries( asignsGruoup, function(item,theCB){
						//item contendría el arreglo de reservas que se van a pedir
						item.reservationIDs = _.compact(item.reservationIDs);
						//$match.id = item.reservationIDs;
						$match._id = { '$in' : item.reservationIDs };
						theReservation.aggregate([
							{ $sort : { createdAt : -1 } }, { $match : $match }
							,{ $project : $projectReservation }
							,{ $group : $groupReservation } 
						],function(err,reservationGroup){
							console.log('reservationGroup',reservationGroup);
							if( reservationGroup.length == 0 ) return theCB(false,false);
							reservationGroup = reservationGroup[0];
							$match = formatFields($match);
							delete $match._id;
							$match.id = item.reservationIDs;
							console.log("MATCH",$match);
							Reservation.find( $match ).populate('hotel').populate('company') //{ id : item.reservationIDs }
							.exec(function(err,reservations){
								if(err||reservations.length==0) return theCB(err,false);
								//aquí se genera el item del row
								var row1 = {
									_id : getItemById(item._id,providers)
									,pax : reservationGroup.pax
									,total : reservationGroup.total
									,rows2 : []
									,comision : reservationGroup.total*.2
								};
								for(var x in reservations){
									//aquí se van a ir agregando los rows2 de row
									row1.rows2.push({
										_id : {}
										,folio : reservations[x].folio
										,pax : reservations[x].pax + ( reservations[x].kidPax || 0 )
										,total : reservations[x].fee + ( reservations[x].feeKids || 0 )
										,company : reservations[x].company
										,arrivalDate : (reservations[x].arrival_date?moment(reservations[x].arrival_date).format('D-MM-YYYY'):'')
										,departureDate : (reservations[x].departure_date?moment(reservations[x].departure_date).format('D-MM-YYYY'):'')
										,hotel : reservations[x].hotel
										,folioAgency : reservations[x].folioAgency
									});
								}
								//Aqui se van a ir sumando totales y pax generales
								results.totals.total += reservationGroup.total;
								results.totals.pax += reservationGroup.pax;
								theCB(false,row1);
							});
						});//reservation aggregate 
					},function(err,rows){
						results.rows = _.compact(rows);
						results.totals.iva = results.totals.total*mainIVA;
						results.totals.subtotal = results.totals.total - results.totals.iva;
						results.totals.comision = results.totals.total * .2;
						results.reportType = 'bygroup';
						cb(results,err);
					});//async end
				});//reservation native end
			});
		});//asign aggregate
	});//asign native end
};
/* 
	Genera un reporte general de los tours vendidos, recibe:
		- fields : filtro de reservas, object
		- cb 	 : callback, function
 */
module.exports.tours_gral = function(fields,cb){
	var results = {
		headers : [ 
			{ label : 'Tour' , handle : 'name', object : '_id' , type : '' }
			,{ label : 'Categoría' , handle : 'category', object : '_id' , type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Ventas' , handle : 'total', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxDev', type : '' }
			,{ label : 'Devolución' , handle : 'totalDev', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', type : 'currency' }
			,{ label : 'IVA' , handle : 'iva', type : 'currency' }
			,{ label : 'Ventas netas' , handle : 'neto', type : 'currency' }
		]
		,title : 'Ventas Tours'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	}
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");
	//fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields; /*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	$match = fields;
	var $groupGral = {
		_id : null
		,toursIDs : { '$push' : '$tour' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$tour'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		,paxDev 	: { $sum : '$paxWDev' }
		,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	console.log($match);
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				arrival_date:1,cancelationDate:1,startDate:1
				,tour:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			//cb( { r:resultsGlobal,match:$match },err );return;
			if( err || typeof resultsGlobal == 'undefined' || !resultsGlobal.length ){ cb(resultsGlobal,err); return; }
			console.log('ENTRA!!!!!!!!!!!');
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			Tour.find({ id : resultsGlobal.toursIDs }).populate('categories').exec(function(err,allTours){
				if( err ){ cb(false,err); return;}
				//iteration
				theReservation.aggregate([ 
					 { $sort  : {createdAt:-1} }
					,{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1 
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
				],function(err,resultsTours){
					if(err){ cb(false,err); return;}
					//obtiene los totales de las reservas
					results.rows = [];
					for(var x in resultsTours){ 
						resultsTours[x]._id = getItemById( resultsTours[x]._id, allTours );
						resultsTours[x].iva = resultsTours[x].neto*mainIVA;
						resultsTours[x].total_iva = resultsTours[x].neto - resultsTours[x].iva;
						resultsTours[x]._id.category = resultsTours[x]._id.categories.length>0?resultsTours[x]._id.categories[0].classification:'';
					}
					results.rows = resultsTours;
					//totales globales
					results.totals.pax =resultsGlobal.pax;
					results.totals.total =resultsGlobal.total;
					results.totals.iva =resultsGlobal.total*mainIVA;
					results.totals.subtotal = resultsGlobal.total - results.totals.iva;
					results.reportType = '';
					results.match = $match;
					cb(results,err);
				});
			});
		}); //get all reservations
	}); //reservation native
}
module.exports.tours_gral2 = function(fields,cb){
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
					{ label : 'Tour' , handle : 'tour', type : '' }
					,{ label : 'Pax' , handle : 'pax', type : '' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi', type : 'currency' }
					,{ label : 'IVA' , handle : 'iva', type : 'currency' }
					,{ label : 'Ventas netas' , handle : 'vn', type : 'currency' }
				]
				,title : 'Ventas de Tours por servicio'
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
module.exports.tours_by_agency_list = function(fields,cb){
	fields.listing = true;
	Reports.tours_by_agency(fields,cb);
}
module.exports.tours_by_agency = function(fields,cb){
	var results = {
		headers : [ 
			{ label : 'Agencia' , handle : 'name', object : '_id', object2:'_id' , type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Ventas' , handle : 'total', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxDev', type : '' }
			,{ label : 'Devolución' , handle : 'totalDev', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', type : 'currency' }
			,{ label : 'IVA' , handle : 'iva', type : 'currency' }
			,{ label : 'Ventas netas' , handle : 'neto', type : 'currency' }
		]
		,title : 'Ventas Tours por Agencia'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	};
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields; 
	delete $match.listing;/*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,usersIDs : { '$push' : '$company' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$company'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		,paxDev 	: { $sum : '$paxWDev' }
		,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
		,toursIDs 	: { $push : '$tour' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				company:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err || resultsGlobal.length == 0 ){ return cb(resultsGlobal,err); }
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			Company.find({ id : resultsGlobal.usersIDs }).exec(function(err,allCompanies){
				//iteration
				theReservation.aggregate([ 
					 { $sort  : {createdAt:-1} }
					,{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, company:1,tour:1
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
				],function(err,resultsTours){
					if( err || resultsTours.length == 0 ){ return cb(resultsTours,err); }
					if(err) console.log(err);
					//obtiene los totales de las reservas
					async.mapSeries( resultsTours, function(item,theCB){
						item._id = getItemById( item._id, allCompanies );
						item.iva = item.neto*mainIVA;
						item.total_iva = item.neto - item.iva;
						if( fields.listing ){
							item.type = 'c';
							$groupTotals._id = '$tour';
							$match.tour = { '$in' : item.toursIDs };
							$match.company = sails.models['company'].mongo.objectId( item._id.id );
							console.log($match);
							theReservation.aggregate([ 
								 { $sort  : {createdAt:-1} }
								,{ $match : $match }
								,{ $project : { 
									fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1,company:1
									,feeSum 	: feeSumVar, paxSum 	: paxSumVar
									,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
									,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
								 } }
								,{ $group : $groupTotals } 
							],function(err,resultsUsers){
								if(err) return theCB(err,item);
								Tour.find({ id : item.toursIDs }).exec(function(err,allTours){
									//obtiene los totales de las reservas
									for( var y in resultsUsers ){
										resultsUsers[y]._id = getItemById( resultsUsers[y]._id, allTours );
										resultsUsers[y].iva = resultsUsers[y].neto*mainIVA;
										resultsUsers[y].total_iva = resultsUsers[y].neto-resultsUsers[y].iva;
									}
									item.allTours = allTours;
									item.rows2 = resultsUsers;
									theCB(err,item);
								});
							});
						}else{
							theCB(err,item)
						}
					},function(err,rows){
						//results
						results.rows = rows;
						//totales globales
						results.totals.pax = resultsGlobal.pax;
						results.totals.total = resultsGlobal.total;
						results.totals.iva = resultsGlobal.total*mainIVA;
						results.totals.subtotal = resultsGlobal.total - results.totals.iva;
						results.reportType = '';
						if( fields.listing ) results.reportType = 'bygroup';
						cb(results,err);
					});
				});
			});
		}); //get all reservations
	}); //reservation native
}
module.exports.tours_by_agency2 = function(fields,cb){
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
					{ label : 'Agencia' , handle : 'company', type : '' }
					,{ label : 'Tour' , handle : 'tour', type : '' }
					,{ label : 'Pax' , handle : 'pax', type : '' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi', type : 'currency' }
					,{ label : 'IVA' , handle : 'iva', type : 'currency' }
					,{ label : 'Ventas netas' , handle : 'vn', type : 'currency' }
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
module.exports.tours_by_hotel_list = function(fields,cb){
	fields.listing = true;
	Reports.tours_by_hotel(fields,cb);
}
module.exports.tours_by_hotel = function(fields,cb){
	var results = {
		headers : [ 
			{ label : 'Hotel' , handle : 'name', object : '_id',object2 : '_id' , type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Ventas' , handle : 'total', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxDev', type : '' }
			,{ label : 'Devolución' , handle : 'totalDev', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', type : 'currency' }
			,{ label : 'IVA' , handle : 'iva', type : 'currency' }
			,{ label : 'Ventas netas' , handle : 'neto', type : 'currency' }
		]
		,title : 'Ventas Tours por Hotel'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	}
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields; 
	delete $match.listing; /*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,hotelsIDs : { '$push' : '$hotel' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$hotel'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		,paxDev 	: { $sum : '$paxWDev' }
		,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
		,toursIDs 	: { $push : '$tour' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				hotel:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1,tour:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err || resultsGlobal.length == 0 ){ return cb(resultsGlobal,err); }
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			Hotel.find({ id : resultsGlobal.hotelsIDs }).exec(function(err,allHotels){
				//iteration
				theReservation.aggregate([ 
					 { $sort  : {createdAt:-1} }
					,{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, hotel:1, tour:1 
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
				],function(err,resultsTours){
					if(err) return cb(resultsTours,err);
					//obtiene los totales de las reservas
					async.mapSeries( resultsTours, function(item,theCB){
						item._id = getItemById( item._id, allHotels );
						item.iva = item.neto*mainIVA;
						item.total_iva = item.neto - item.iva;
						if( fields.listing ){
							item.type = 'c';
							$groupTotals._id = '$tour';
							$match.tour = { '$in' : item.toursIDs };
							$match.hotel = sails.models['hotel'].mongo.objectId( item._id.id );
							//console.log($match);
							theReservation.aggregate([ 
								 { $sort  : {createdAt:-1} }
								,{ $match : $match }
								,{ $project : { 
									fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1,hotel:1
									,feeSum 	: feeSumVar, paxSum 	: paxSumVar
									,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
									,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
								 } }
								,{ $group : $groupTotals } 
							],function(err,resultsHotels){
								if(err) return theCB(err,item);
								Tour.find({ id : item.toursIDs }).exec(function(err,allTours){
									//obtiene los totales de las reservas
									for( var y in resultsHotels ){
										resultsHotels[y]._id = getItemById( resultsHotels[y]._id, allTours );
										resultsHotels[y].iva = resultsHotels[y].neto*mainIVA;
										resultsHotels[y].total_iva = resultsHotels[y].neto-resultsHotels[y].iva;
									}
									//item.allTours = allTours;
									item.rows2 = resultsHotels;
									theCB(err,item);
								});
							});
						}else{
							theCB(err,item);
						}
					},function(err,rows){
						results.rows = rows;
						//totales globales
						results.totals.pax =resultsGlobal.pax;
						results.totals.total =resultsGlobal.total;
						results.totals.iva =resultsGlobal.total*mainIVA;
						results.totals.subtotal = resultsGlobal.total - results.totals.iva;
						results.reportType = '';
						if( fields.listing ) results.reportType = 'bygroup';
						cb(results,err);
					});
					//for(var x in resultsTours){ }
					//results.allUsers = allUsers;
					//results.resultsGlobal = resultsGlobal;
					
				});
			});
		}); //get all reservations
	}); //reservation native
}
module.exports.tours_by_user_list = function(fields,cb){
	fields.listing = true;
	Reports.tours_by_user( fields, cb );
}
module.exports.tours_by_user = function(fields,cb){
	var results = {
		headers : [ 
			{ label : 'Usuario' , handle : 'name', object : '_id', object2:'_id' , type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Ventas' , handle : 'total', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxDev', type : '' }
			,{ label : 'Devolución' , handle : 'totalDev', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', type : 'currency' }
			,{ label : 'IVA' , handle : 'iva', type : 'currency' }
			,{ label : 'Ventas netas' , handle : 'neto', type : 'currency' }
		]
		,title : 'Ventas Tours por Usuario'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	}
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields;
	delete $match.listing;
	/*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,usersIDs : { '$push' : '$user' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$user'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		,paxDev 	: { $sum : '$paxWDev' }
		,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
		,toursIDs 	: { $push : '$tour' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				user:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1, tour:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err || resultsGlobal.length == 0 ){ return cb(resultsGlobal,err); }
			console.log('resultsGlobal!!!!!!!!!!!!!!!',resultsGlobal.length,resultsGlobal);
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			User.find({ id : resultsGlobal.usersIDs }).exec(function(err,allUsers){
				//iteration
				theReservation.aggregate([ 
					 { $sort  : {createdAt:-1} }
					,{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, user:1, tour:1
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
				],function(err,resultsTours){
					if(err) return cb(resultsTours,err);
					//obtiene los totales de las reservas
					async.mapSeries( resultsTours, function(item,theCB){
						//iteration
						item._id = getItemById( item._id, allUsers );
						item.iva = item.neto*mainIVA;
						item.total_iva = item.neto - item.iva;
						if( fields.listing ){
							item.type = 'c';
							$groupTotals._id = '$tour';
							$match.tour = { '$in' : item.toursIDs };
							$match.user = sails.models['user'].mongo.objectId( item._id.id );
							console.log($match);
							theReservation.aggregate([ 
								 { $sort  : {createdAt:-1} }
								,{ $match : $match }
								,{ $project : { 
									fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1,user:1
									,feeSum 	: feeSumVar, paxSum 	: paxSumVar
									,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
									,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
								 } }
								,{ $group : $groupTotals } 
							],function(err,resultsUsers){
								if(err) return cb(resultsUsers,err);
								Tour.find({ id : item.toursIDs }).exec(function(err,allTours){
									if(err) return theCB(err,item);
									//obtiene los totales de las reservas
									for( var y in resultsUsers ){
										resultsUsers[y]._id = getItemById( resultsUsers[y]._id, allTours );
										resultsUsers[y].iva = resultsUsers[y].neto*mainIVA;
										resultsUsers[y].total_iva = resultsUsers[y].neto-resultsUsers[y].iva;
									}
									//item.allTours = allTours;
									item.rows2 = resultsUsers;
									theCB(err,item);
								});
							});
						}else{
							theCB(err,item);
						}
					},function(err,rows){
						//results
						results.rows = rows;
						//totales globales
						results.totals.pax =resultsGlobal.pax;
						results.totals.total =resultsGlobal.total;
						results.totals.iva =resultsGlobal.total*mainIVA;
						results.totals.subtotal = resultsGlobal.total - results.totals.iva;
						results.reportType = '';
						if( fields.listing ) results.reportType = 'bygroup';
						cb(results,err);
					});
					/*for(var x in resultsTours){ 
						resultsTours[x]._id = getItemById( resultsTours[x]._id, allUsers );
						resultsTours[x].iva = resultsTours[x].neto*mainIVA;
						resultsTours[x].total_iva = resultsTours[x].neto - resultsTours[x].iva;
					}*/
					//results.allUsers = allUsers;
					//results.resultsGlobal = resultsGlobal;
					/*results.rows = resultsTours;
					//totales globales
					results.totals.pax =resultsGlobal.pax;
					results.totals.total =resultsGlobal.total;
					results.totals.iva =resultsGlobal.total*mainIVA;
					results.totals.subtotal = resultsGlobal.total - results.totals.iva;
					results.reportType = '';
					cb(results,err);*/
				});
			});
		}); //get all reservations
	}); //reservation native
}
module.exports.tours_by_user2 = function(fields,cb){
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
					{ label : 'Usuario' , handle : 'user', type : '' }
					,{ label : 'Tour' , handle : 'tour', type : '' }
					,{ label : 'Pax' , handle : 'pax', type : '' }
					,{ label : 'Vta.s/IVA' , handle : 'vsi', type : 'currency' }
					,{ label : 'IVA' , handle : 'iva', type : 'currency' }
					,{ label : 'Ventas netas' , handle : 'vn', type : 'currency' }
					,{ label : 'Comisión' , handle : 'cm', type : 'currency' }
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
				results.rows[ '0_' + reservations[x].user.id ].rows2[ reservations[x].tour.id ].cm += (parseFloat(reservations[x].commission_sales)/100) * fee; //total comisión por tour
				results.rows[ '0_' + reservations[x].user.id ].cm += (parseFloat(reservations[x].commission_sales)/100) * fee; //total comisión por tour
				//console.log( fee );console.log( reservations[x].commission_sales );

				results.totals.total += fee;
				results.totals.subtotal += fee - (fee * mainIVA);
				results.totals.iva += fee * mainIVA;
				results.totals.pax += (reservations[x].pax||0) + (reservations[x].kidPax||0);
			}
			results.reportType = 'bygroup';
			cb(results,false);
		});//Reservation END
	});//Reservation count END
};
module.exports.tours_by_payment_method_list = function(fields,cb){
	fields.listing = true;
	Reports.tours_by_payment_method( fields, cb );
}
module.exports.tours_by_payment_method = function(fields,cb){
	var results = {
		headers : [ 
			 { label : 'Forma de pago' , handle : 'name', object2:'x' , type : '' }
			,{ label : 'Cupón' , handle : 'controlCode', type : '' }
			,{ label : 'Fecha' , handle : 'createdAt', type : '' }
			,{ label : 'Reserva' , handle : 'folio', type : '' }
			,{ label : 'Servicio' , handle : 'name', object:'_id' , object2:'tour', type : '' }
			,{ label : 'Pax' , handle : 'pax', type : '' }
			,{ label : 'Ventas' , handle : 'total', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxDev', type : '' }
			,{ label : 'Devolución' , handle : 'totalDev', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Ventas netas' , handle : 'neto', type : 'currency' }
		]
		,title : 'Ventas Tours por Forma de pago'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	}
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	var $match = fields; 
	delete $match.listing;/*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,toursIDs : { '$push' : '$tour' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$payment_method'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		,paxDev 	: { $sum : '$paxWDev' }
		,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
		//,toursIDs 	: { $push : '$tour' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				payment_method:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1, tour:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err || resultsGlobal.length == 0 ){ return cb(resultsGlobal,err); }
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			Tour.find({ id : resultsGlobal.toursIDs }).exec(function(err,allTours){
				if( err ){ return cb(resultsGlobal,err); }
				//iteration
				theReservation.aggregate([ 
					 { $sort  : {createdAt:-1} }
					,{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, payment_method:1, tour:1
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
				],function(err,resultsTours){
					if( err ){ return cb(resultsGlobal,err); }
					//obtiene los totales de las reservas
					async.mapSeries( resultsTours, function(item,theCB){
						//iteration
						item.name = item._id;
						if( fields.listing ){
							item.type = 'c';
							$groupTotals._id = '$_id';
							$groupTotals.controlCode = { $push : '$controlCode' };
							$groupTotals.createdAt = { $push : '$createdAt' };
							$groupTotals.folio = { $push : '$folio' };
							$groupTotals.tour = { $push : '$tour' };
							//$match.tour = { '$in' : item.toursIDs };
							$match.payment_method = item._id;
							//console.log($match);
							theReservation.aggregate([ 
								 { $sort  : {createdAt:-1} }
								,{ $match : $match }
								,{ $project : { 
									fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1,payment_method:1
									,createdAt:1, folio:1, controlCode 	: 1
									,feeSum 	: feeSumVar, paxSum 	: paxSumVar
									,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
									,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
								 } }
								,{ $group : $groupTotals } 
							],function(err,resultsPM){
								if( err ){ return theCB(err,item); }
								//obtiene los totales de las reservas
								for( var y in resultsPM ){
									resultsPM[y].tour = getItemById( resultsPM[y].tour[0], allTours );
									resultsPM[y].folio = resultsPM[y].folio[0];
									resultsPM[y].controlCode = resultsPM[y].controlCode[0]?resultsPM[y].controlCode[0]:'';
									resultsPM[y].createdAt = formatDate(resultsPM[y].createdAt[0],'DD/MM/YYYY');
								}
								item.rows2 = resultsPM;
								theCB(err,item);
							});
						}else{
							theCB(err,item);
						}
					},function(err,rows){
						//results
						results.rows = rows;
						//totales globales
						results.totals.pax =resultsGlobal.pax;
						results.totals.total =resultsGlobal.total;
						results.totals.iva =resultsGlobal.total*mainIVA;
						results.totals.subtotal = resultsGlobal.total - results.totals.iva;
						results.reportType = '';
						if( fields.listing ) results.reportType = 'bygroup';
						cb(results,err);
					});
				});
			});
		}); //get all reservations
	}); //reservation native
}
module.exports.tours_cupon_by_user = function(fields,cb){
	var results = {
		headers : [ 
			 { label : 'Vendedor' , handle : 'name', object:'_id' , object2:'x' , type : '' }
			,{ label : 'Cupón' , handle : 'controlCode', type : '' }
			,{ label : 'Fecha/Venta' , handle : 'createdAt', type : '' }
			,{ label : 'Fecha/Serv' , handle : 'startDate', type : '' }
			,{ label : 'Reserva' , handle : 'folio', type : '' }
			,{ label : 'Agencia' , handle : 'name', object:'x', object2:'company' , type : '' }
			,{ label : 'Hotel' , handle : 'name', object:'x', object2:'hotel' , type : '' }
			,{ label : 'Servicio' , handle : 'name', object:'x' , object2:'tour', type : '' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', type : 'currency' }
			,{ label : 'IVA' , handle : 'iva', type : 'currency' }
			,{ label : 'Total' , handle : 'neto', type : 'currency' }
		]
		,title : 'Cupones por vendedor'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	}
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields; /*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,toursIDs : { '$push' : '$tour' }
		,hotelsIDs : { '$push' : '$hotel' }
		,companiesIDs : { '$push' : '$company' }
		,usersIDs : { '$push' : '$user' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$user'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		//,paxDev 	: { $sum : '$paxWDev' }
		//,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
		//,toursIDs 	: { $push : '$tour' }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				payment_method:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1, tour:1, user:1, company:1, hotel:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err || resultsGlobal.length == 0 ){ return cb(resultsGlobal,err); }
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			Tour.find({ id : resultsGlobal.toursIDs }).exec(function(err,allTours){
			Hotel.find({ id : resultsGlobal.hotelsIDs }).exec(function(err,allHotels){
			Company.find({ id : resultsGlobal.companiesIDs }).exec(function(err,allCompanies){
			User.find({ id : resultsGlobal.usersIDs }).exec(function(err,allUsers){
				//iteration
				theReservation.aggregate([ 
					 { $sort  : {createdAt:-1} }
					,{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1, user:1, company:1, hotel:1
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						//,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
						//,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
				],function(err,resultsTours){
					if(err) console.log(err);
					//obtiene los totales de las reservas
					async.mapSeries( resultsTours, function(item,theCB){
						//iteration
						item._id = getItemById(item._id,allUsers);
						item.type = 'c';
						$groupTotals._id = '$_id';
						$groupTotals.controlCode = { $push : '$controlCode' };
						$groupTotals.createdAt = { $push : '$createdAt' };
						$groupTotals.startDate = { $push : '$startDate' };
						$groupTotals.folio = { $push : '$folio' };
						$groupTotals.state = { $push : '$state' };
						$groupTotals.tour = { $push : '$tour' };
						$groupTotals.hotel = { $push : '$hotel' };
						$groupTotals.company = { $push : '$company' };
						//$match.tour = { '$in' : item.toursIDs };
						$match.user = sails.models['user'].mongo.objectId( item._id.id );
						//console.log($match);
						theReservation.aggregate([ 
							 { $sort  : {createdAt:-1} }
							,{ $match : $match }
							,{ $project : { 
								fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1
								,hotel:1,company:1,user:1,startDate:1
								,createdAt:1, folio:1, controlCode 	: 1
								,feeSum 	: feeSumVar, paxSum 	: paxSumVar
								//,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
								//,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
								,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
								,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
							 } }
							,{ $group : $groupTotals } 
						],function(err,resultsPM){
							if(err) console.log(err);
							//obtiene los totales de las reservas
							for( var y in resultsPM ){
								resultsPM[y].tour = getItemById( resultsPM[y].tour[0], allTours );
								resultsPM[y].hotel = getItemById( resultsPM[y].hotel[0], allHotels );
								resultsPM[y].company = getItemById( resultsPM[y].company[0], allCompanies );
								resultsPM[y].folio = resultsPM[y].folio[0];
								resultsPM[y].controlCode = resultsPM[y].controlCode[0]?resultsPM[y].controlCode[0]:'';
								resultsPM[y].createdAt = formatDate(resultsPM[y].createdAt[0],'DD/MM/YYYY');
								resultsPM[y].startDate = formatDate(resultsPM[y].startDate[0],'DD/MM/YYYY');
								resultsPM[y].iva = resultsPM[y].neto * mainIVA;
								resultsPM[y].total_iva = resultsPM[y].neto - resultsPM[y].iva;

							}
							item.rows2 = resultsPM;
							theCB(err,item);
						});
					},function(err,rows){
						//results
						results.rows = rows;
						//results.allHotels = allHotels;
						//totales globales
						results.totals.pax =resultsGlobal.pax;
						results.totals.total =resultsGlobal.total;
						results.totals.iva =resultsGlobal.total*mainIVA;
						results.totals.subtotal = resultsGlobal.total - results.totals.iva;
						results.reportType = 'bygroup';
						cb(results,err);
					});
				});
			});//all users
			});//all companies
			});//all hotels
			});//all tours
		}); //get all reservations
	}); //reservation native
}
module.exports.tours_by_provider_list = function(fields,theCB){
	fields.listing = true;
	Reports.tours_by_provider( fields, theCB );
}
module.exports.tours_by_provider = function(fields,theCB){
	var results = {
		headers : [ 
			{ label : 'Proveedor' , handle : 'name', object : '_id', object2 : '_id' , type : '' }
			,{ label : 'Pax' , handle : 'pax', object : 'resultsProvider', type : '' }
			,{ label : 'Ventas' , handle : 'total', object : 'resultsProvider', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxDev', object : 'resultsProvider', type : '' }
			,{ label : 'Devolución' , handle : 'totalDev', object : 'resultsProvider', type : 'currency' }
			,{ label : 'Pax' , handle : 'paxneto', object : 'resultsProvider', type : '' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', object : 'resultsProvider', type : 'currency' }
			,{ label : 'IVA' , handle : 'iva', object:'resultsProvider', type : 'currency' }
			,{ label : 'Ventas netas' , handle : 'neto', object:'resultsProvider', type : 'currency' }
		]
		,title : 'Ventas Tours por Proveedor'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	}
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields; 
	delete $match.listing;/*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,toursIDs : { '$push' : '$tour' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTours = {
		_id : '$provider'
		,toursIDsByProvider : { '$push' : '$_id' }
		,providersArray : { '$push' : '$provider' }
	}
	var $groupTotals = {
		_id 		: null
		,pax 		: { $sum : '$paxSum' }
		//,kidPax 		: { $sum : '$kidPax' }
		,total 		: { $sum : '$feeSum' }
		//,feeKids 		: { $sum : '$feeKids' }
		,paxDev 	: { $sum : '$paxWDev' }
		,totalDev 	: { $sum : '$totalWDev' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				tour:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err ){ return cb(resultsGlobal,err); }
			Tour.native(function(err,theTour){
				//console.log(resultsGlobal);
				if( err || resultsGlobal.length == 0 ){ 
					return theCB(resultsGlobal,err);
				}
				resultsGlobal = resultsGlobal[0];
				theTour.aggregate([ { $sort : {createdAt : -1}}, {$match : { _id : { "$in" : resultsGlobal.toursIDs} }}, { $group : $groupTours } ],function(err,resultsTours){
					var allProviders = [];
					for( var x in resultsTours ) allProviders.push( resultsTours[x].providersArray );
					//obtener los proveedores
					//console.log(allProviders);
					TourProvider.find({ id : allProviders }).exec(function(err,allProviders){
						async.mapSeries( resultsTours, function(item,cb){
							//iteration
							$match.tour = { "$in" : item.toursIDsByProvider };
							theReservation.aggregate([ 
								 { $sort  : {createdAt:-1} }
								,{ $match : $match }
								,{ $project : { 
									fee:1, pax:1, state:1, feeKids:1, kidPax:1
									,feeSum 	: feeSumVar, paxSum 	: paxSumVar
									,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
									,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
									,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
								 } }
								,{ $group : $groupTotals } 
							],function(err,resultsProvider){
								if(err) console.log(err);
								//obtiene los totales de las reservas
								resultsProvider = resultsProvider[0];
								item._id = getItemById( item._id, allProviders );
								resultsProvider.iva = resultsProvider.neto*mainIVA;
								resultsProvider.total_iva = resultsProvider.neto-resultsProvider.iva;
								item.resultsProvider = resultsProvider;
								if( fields.listing ){
									item.type = 'c';
									results.reportType = 'bygroup';
									$groupTotals._id = '$tour';
									theReservation.aggregate([ 
										 { $sort  : {createdAt:-1} }
										,{ $match : $match }
										,{ $project : { 
											fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1
											,feeSum 	: feeSumVar, paxSum 	: paxSumVar
											,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
											,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
											,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
											,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
										 } }
										,{ $group : $groupTotals } 
									],function(err,resultsProviderInside){
										if(err) console.log(err);
										Tour.find({ id : item.toursIDsByProvider }).exec(function(err,allTours){
											//obtiene los totales de las reservas
											for( var y in resultsProviderInside ){
												resultsProviderInside[y]._id = getItemById( resultsProviderInside[y]._id, allTours );
												resultsProviderInside[y].iva = resultsProviderInside[y].neto*mainIVA;
												resultsProviderInside[y].total_iva = resultsProviderInside[y].neto-resultsProviderInside[y].iva;
											}
											item.allTours = allTours;
											item.rows2 = resultsProviderInside;
											cb(err,item);
										});
									});
								}else{
									cb(err,item);
								}
							});
						},function(err,rows){
							//results
							results.totals.total = resultsGlobal.total;
							results.totals.pax = resultsGlobal.pax;
							results.totals.iva = resultsGlobal.total*mainIVA;
							results.totals.subtotal = resultsGlobal.total - results.totals.iva;
							results.rows = rows;
							theCB(results,err);
						});
					});
				});
			});
		}); //get all reservations
	}); //reservation native
};
module.exports.tours_commision_by_cupon =function(fields,cb){
	var results = {
		headers : [ 
			 { label : 'Vendedor' , handle : 'name', object:'_id' , object2:'x' , type : '' }
			,{ label : 'Cupón' , handle : 'controlCode', type : '' }
			,{ label : 'Fecha/Venta' , handle : 'createdAt', type : '' }
			,{ label : 'Fecha/Serv' , handle : 'startDate', type : '' }
			,{ label : 'Reserva' , handle : 'folio', type : '' }
			//,{ label : 'Agencia' , handle : 'name', object:'x', object2:'company' , type : '' }
			,{ label : 'Hotel' , handle : 'name', object:'x', object2:'hotel' , type : '' }
			,{ label : 'Servicio' , handle : 'name', object:'x' , object2:'tour', type : '' }
			,{ label : 'Pax' , handle : 'paxneto', type : '' }
			,{ label : 'Total' , handle : 'neto', type : 'currency' }
			,{ label : 'Vta.s/IVA' , handle : 'total_iva', type : 'currency' }
			,{ label : 'Comisión' , handle : 'cm', type : 'currency' }
		]
		,title : 'Comisiones de Tours por Vendedor'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	};
	/*
		Para saber si es por la fecha de creación o la de reservación
		options.dateType = '1';
	*/
	//fields.sDate = new Date("October 13, 2014");fields.eDate = new Date("October 13, 2016");
	fields.reservation_type = 'tour';
	if(!fields.state) fields.state = 'liquidated';
	var $match = fields; /*{
		reservation_type : 'tour'
		,$and : [
			//{ $or : [ { state : 'pending' } , { state : 'canceled' } ] },
			{ $or : [ 
				{ createdAt : { $gte : fields.sDate , $lte : fields.eDate } } 
				,{ cancelationDate : { $gte : fields.sDate , $lte : fields.eDate } } 
			] }
		]
	};*/
	var $groupGral = {
		_id : null
		,toursIDs : { '$push' : '$tour' }
		,hotelsIDs : { '$push' : '$hotel' }
		//,companiesIDs : { '$push' : '$company' }
		,usersIDs : { '$push' : '$user' }
		,total : { $sum : '$totalNeto' }
		,pax : { $sum : '$paxNeto' }
	};
	var $groupTotals = {
		_id 		: '$user'
		,pax 		: { $sum : '$paxSum' }
		,total 		: { $sum : '$feeSum' }
		,paxneto 	: { $sum : '$paxWithoutDev' }
		,neto 		: { $sum : '$totalWithoutDev' }
		,count 		: { $sum : 1 }
	};
	var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
	var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
	Reservation.native(function(err,theReservation){
		theReservation.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $project : {
				payment_method:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1, tour:1, user:1, company:1, hotel:1
				,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
				,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			} }
			,{ $group : $groupGral } 
		],function(err,resultsGlobal){ 
			if( err || resultsGlobal.length == 0 ){ return cb(resultsGlobal,err); }
			resultsGlobal = resultsGlobal[0];
			//obtener los proveedores;
			Tour.find({ id : resultsGlobal.toursIDs }).exec(function(err,allTours){
			Hotel.find({ id : resultsGlobal.hotelsIDs }).exec(function(err,allHotels){
			User.find({ id : resultsGlobal.usersIDs }).exec(function(err,allUsers){
				//iteration
				theReservation.aggregate([ 
					{ $match : $match }
					,{ $project : { 
						fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1, user:1, company:1, hotel:1
						,feeSum 	: feeSumVar, paxSum 	: paxSumVar
						,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
						,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
					 } }
					,{ $group : $groupTotals } 
					,{ $sort  : {neto:-1} }
				],function(err,resultsTours){
					if(err) console.log(err);
					//obtiene los totales de las reservas
					async.mapSeries( resultsTours, function(item,theCB){
						//iteration
						item._id = getItemById(item._id,allUsers);
						item.type = 'c';
						$groupTotals._id = '$_id';
						$groupTotals.controlCode = { $push : '$controlCode' };
						$groupTotals.createdAt = { $push : '$createdAt' };
						$groupTotals.startDate = { $push : '$startDate' };
						$groupTotals.folio = { $push : '$folio' };
						//$groupTotals.state = { $push : '$state' };
						$groupTotals.commission_sales = { $push : '$commission_sales' };
						$groupTotals.tour = { $push : '$tour' };
						$groupTotals.hotel = { $push : '$hotel' };
						$groupTotals.company = { $push : '$company' };
						//$match.tour = { '$in' : item.toursIDs };
						$match.user = sails.models['user'].mongo.objectId( item._id.id );
						//console.log($match);
						theReservation.aggregate([ 
							 { $sort  : {createdAt:-1} }
							,{ $match : $match }
							,{ $project : { 
								fee:1, pax:1, state:1, feeKids:1, kidPax:1, tour:1
								,hotel:1,company:1,user:1,startDate:1
								,createdAt:1, folio:1, controlCode 	: 1,commission_sales:1
								,feeSum 	: feeSumVar, paxSum 	: paxSumVar
								//,totalWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },feeSumVar,0 ] }
								//,paxWDev 	: { $cond : [ { $eq : ['$state' , 'canceled'] },paxSumVar,0 ] }
								,totalWithoutDev 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
								,paxWithoutDev 		: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
							 } }
							,{ $group : $groupTotals } 
						],function(err,resultsPM){
							if(err) console.log(err);
							//obtiene los totales de las reservas
							for( var y in resultsPM ){
								resultsPM[y].tour = getItemById( resultsPM[y].tour, allTours );
								resultsPM[y].hotel = getItemById( resultsPM[y].hotel, allHotels );
								//resultsPM[y].company = getItemById( resultsPM[y].company, allCompanies );
								resultsPM[y].folio = resultsPM[y].folio[0];
								resultsPM[y].controlCode = resultsPM[y].controlCode[0]?resultsPM[y].controlCode[0]:'';
								resultsPM[y].createdAt = formatDate(resultsPM[y].createdAt[0],'DD/MM/YYYY');
								resultsPM[y].startDate = formatDate(resultsPM[y].startDate[0],'DD/MM/YYYY');
								resultsPM[y].iva = resultsPM[y].neto * mainIVA;
								resultsPM[y].total_iva = resultsPM[y].neto - resultsPM[y].iva;
								resultsPM[y].cm = resultsPM[y].total_iva * (resultsPM[y].commission_sales[0]/100);
							}
							item.rows2 = resultsPM;
							theCB(err,item);
						});
					},function(err,rows){
						//results
						results.rows = rows;
						//results.allHotels = allHotels;
						//totales globales
						results.totals.pax =resultsGlobal.pax;
						results.totals.total =resultsGlobal.total;
						results.totals.iva =resultsGlobal.total*mainIVA;
						results.totals.subtotal = resultsGlobal.total - results.totals.iva;
						results.reportType = 'bygroup';
						cb(results,err);
					});
				});
			});//all users
			});//all hotels
			});//all tours
		}); //get all reservations
	}); //reservation native
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
module.exports.logisticsReport = function(options,theCB){
	var name = 'Export reservations -' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
	options.dateType = '1';
	options.sDate = new Date("October 13, 2014");
	options.eDate = new Date("October 13, 2016");
	var $match = {
		reservation_type : 'transfer'
		/*,state : 'liquidated'
		,$and : [
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
	Reservation.find( $match ).populate('currency').populate('transfer').populate('airport').populate('hotel')
	.populate('order').populate('company').populate('client').populate('departure_airline')
	.exec(function(r_err,list_reservations){
		if(r_err) theCB(false,r_err);
		var toCSV = [];
		toCSV.push([
			'Fecha','Estatus','Tipo reserva','Lugar origen','Clave reserva','Tipo de servicio'
			,'Tipo de viaje','Clave tipo de unidad','Nombre tipo de unidad','Clave hotel'
			,'Nombre hotel','Habitación','Nmbre pasajero','Apellidos pasajero','Adultos','Niños'
			,'Fecha llegada','Hora llegada','Fecha salida','Clave aerolinea salida','Nombre aerolinea'
			,'Hora vuelo','Hora pickup','Precio','Precio niño','Descuento','Subtotal','Total','Moneda','Tipo de cambio'
			,'Observaciones','Clave agencia','Nombre agencia','Reserva de agencia']);
		if( list_reservations ){ for( var x in list_reservations ){
			var l = list_reservations[x];
			var item = Reports.mkpFormatItemToExport(l,false);
			toCSV.push(item);
		} }//if reservations END
		theCB(toCSV,false);
	});//reservation find END
};
module.exports.totalsReport = function(options,theCB){
	var name = 'Totals report -' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
	options.dateType = '1';
	options.sDate = new Date("October 13, 2014");
	options.eDate = new Date("October 13, 2016");
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
		total: { '$sum': '$fee' }
		,totalKids: { '$sum': '$feeKids' }
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
					Hotel.find({ id : resultsForPopulate[0].hotels }).populate('zone').exec(function(err,hotels){
						if(err) theCB(false,err);
						resultsPopulated.hotels = hotels || [];
						CuponSingle.find({ id : resultsForPopulate[0].cupons }).populate('cupon').exec(function(err,cupons){
							if(err) theCB(false,err);
							resultsPopulated.cupons = cupons || [];
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
				//console.log(resultsForPopulate);
				//console.log(resultsPopulated);
				var toCSV = [];
				toCSV.push(['referencia', 'Pax', 'Total web', 'Descuento', 'Cupón', 'Precio yellow', 'Precio agencia', 'Diferencia yellow/agencia', 'Agencia diferencia', 'Comisión', 'Precio neto', 'Moneda', 'Region', 'Amount of Services', 'Service type', 'Metodo de pago', 'Airport', 'Servicio', 'Reservation Date', 'Status', 'Servicio completado'])
				if( list_reservations ){ for( var x in list_reservations ){
					var l = list_reservations[x];
					var i = 0;
					var item = [];
					var cupon = getItemById( l.cupon, resultsPopulated.cupons );
					var travelType = 'O';
	    			if( l.type == 'one_way' ) travelType = l.origin == 'hotel'?'R':'L';
					item[i] = l.folio;
					item[++i] = l.pax;
					item[++i] = l.fee + l.feeKids;
					if( cupon )
						item[++i] = l.type=='round_trip'?cupon.cupon.round_discount:cupon.cupon.simple_discount;//descuento
					else
						item[++i] = 0;
					item[++i] = cupon?cupon.token:'no';//cupón
					item[++i] = 0;//precio yellow
					item[++i] = 0;//precio agencia
					item[++i] = 0;//diferencia yellow/agencia
					item[++i] = 0;//diferencia agencia
					item[++i] = l.commission_agency;//comisión
					item[++i] = l.commission_agency ? l.fee - ( l.fee * l.commission_agency ) : l.fee;//precio neto?
					item[++i] = l.currency.currency_code;
					var hotel = getItemById(l.hotel,resultsPopulated.hotels);
					item[++i] = hotel.zone?hotel.zone.name:'NOOOOOOOOOOOOOOOOOOOOOO';
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
};
var getItemById = function(id,objectArray){
	var r = false;
	if( objectArray && objectArray.length > 0 )
		for(var x in objectArray)
			if( objectArray[x].id == id )
				return objectArray[x];
	return r;
};
var formatDate = function(date,format){ return date?moment(date).format(format):''; }
module.exports.mkpFormatDateTime = function(date,type){
	var result = date?date:'';
	if( type == 'date' && result != '' ){
		result = moment(date).format('YYYYMMDD');
	}else if( type == 'time' && result != '' ){
		result = moment(date).format('HHmm');
	}
	return result;
}
module.exports.mkpFormatItemToExport = function(reservation,cupon){
	var i = 0;
	var item = [];
	var travelType = 'O';
	if( reservation.type == 'one_way' ) travelType = reservation.origin == 'hotel'?'R':'L';
	item[i] = Reports.mkpFormatDateTime(reservation.createdAt,'date');
	item[++i] = 'N';
	item[++i] = 2;//Tipo reserva
	item[++i] = reservation.origin;
	item[++i] = reservation.folio;
	item[++i] = reservation.transfer.service_type;
	item[++i] = travelType;
	item[++i] = '';//clave tipo unidad
	item[++i] = reservation.transfer.name;
	item[++i] = reservation.hotel?reservation.hotel.mkpid:'';
	item[++i] = reservation.hotel?reservation.hotel.name:'';
	item[++i] = reservation.room||'';
	item[++i] = reservation.client.name;
	item[++i] = '';//last name
	item[++i] = reservation.pax;
	item[++i] = reservation.kidPax||0;
	item[++i] = Reports.mkpFormatDateTime(reservation.arrival_date,'date');
	item[++i] = Reports.mkpFormatDateTime(reservation.arrival_time,'time');
	item[++i] = Reports.mkpFormatDateTime(reservation.departure_date,'date');
	item[++i] = reservation.departure_airline?(reservation.departure_airline.mkpid||''):'';
	item[++i] = reservation.departure_airline?reservation.departure_airline.name:'';
	item[++i] = Reports.mkpFormatDateTime(reservation.departure_time,'time');
	item[++i] = Reports.mkpFormatDateTime(reservation.departurepickup_time,'time');
	item[++i] = reservation.type=='one_way'?reservation.main_fee_adults || reservation.fee_adults : reservation.main_fee_adults_rt || reservation.fee_adults_rt;
	item[++i] = reservation.type=='one_way'?reservation.main_fee_kids || reservation.fee_kids : reservation.main_fee_kids_rt || reservation.fee_kids_rt;
	if( cupon )
		item[++i] = reservation.type=='round_trip'?cupon.cupon.round_discount:cupon.cupon.simple_discount;//descuento
	else
		item[++i] = 0;
	item[++i] = reservation.fee + reservation.feeKids;
	item[++i] = reservation.fee + reservation.feeKids;
	item[++i] = '';
	item[++i] = reservation.currency.currency_code;
	item[++i] = reservation.notes;
	item[++i] = reservation.company.mkpid||'';
	item[++i] = reservation.company.name;
	item[++i] = '';//reserva de agencia
	return item;
}
/*
	Reporte de ventas
		- Total de reservaciones
		- Total de reservaciones completadas
		- Total de reservaciones NO comppletadas
	Las 3 versiones se regresan deben de tener los siguiente
		En dólares y luego en pesos se repite todo
			-Total
			- Callcenter
			- callcenter creditcard
			- callcenter paypay
			- callcenter others
			- Web
			- Web creditcard
			- Web paypal
			- Web others
*/
module.exports.fees_report_transfers_by_agency = function(fields,cb){
	var results = {
		headers : [ 
			{ label : 'Agencia', handle : 'company', type : '' }
			,{ label : 'Descripción', handle : 'description', type : '' }
			,{ label : 'Número de reservas', handle : 'quantity', type : '' }
			,{ label : 'Total', handle : 'total', type : 'currency' }
			,{ label : 'Pax', handle : 'pax', type : '' }
		]
		,title : 'Reporte de ventas por agencia'
		,rows : {}
		,totals : { total : 0 , subtotal : 0 , iva : 0 , pax : 0 }
	};
	getCurrencies(function(currencies){
		if(!currencies) return cb([],'no currencies');
		var $match = fields || {};
		$match.reservation_type = 'transfer';
		if(!$match.state) $match.state = 'liquidated';
		var $groupGral = {
			_id : null
			,companyIDs : { '$push' : '$company' }
			,total : { $sum : '$totalNeto' } //Total global
			,pax : { $sum : '$paxNeto' } //Total Pax global
		};
		var feeSumVar = { $add : [ { $ifNull : [ '$fee', 0 ] } , { $ifNull : [ '$feeKids', 0 ] } ] };
		var paxSumVar = { $add : [ { $ifNull : [ '$pax', 0 ] } , { $ifNull : [ '$kidPax', 0 ] }	] };
		var $projectGral = {
			company:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1,hotel:1,reservation_method:1,payment_method:1
			,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
			,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
		};
		var conditions = {
			dll : { //falta que le agregue la moneda
				dllAll : { $and : [ { $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] } 
				,callcenter : { $and : [ { $eq : ['$reservation_method','intern'] }, { $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,callcenterCreditcard : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$payment_method','creditcard'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,callcenterConekta : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$payment_method','conekta'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,callcenterPaypal : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$payment_method','paypal'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,web : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,webCreditcard : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$payment_method','creditcard'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,webConekta : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$payment_method','conekta'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
				,webPaypal : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$payment_method','paypal'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.usd.id) ] } ] }
			}
			,mxn : {
				mxnAll : { $and : [ { $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] } 
				,callcenter : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,callcenterCreditcard : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$payment_method','creditcard'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,callcenterConekta : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$payment_method','conekta'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,callcenterPaypal : { $and : [ { $eq : ['$reservation_method','intern'] },{ $eq : ['$payment_method','paypal'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,web : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,webCreditcard : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$payment_method','creditcard'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,webConekta : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$payment_method','conekta'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
				,webPaypal : { $and : [ { $eq : ['$reservation_method','web'] },{ $eq : ['$payment_method','paypal'] },{ $eq : ['$currency', sails.models['currency'].mongo.objectId(currencies.mxn.id) ] } ] }
			}
		};
		var $groupCompany = {
			_id : null
			,companyIDs : { '$push' : '$company' }
			,total : { $sum : '$totalNeto' } //Total de la compañía
			,pax : { $sum : '$paxNeto' } //Total Pax de la compañía
			,dll_all : { $sum : '$dll_all' }
			,dll_allPax : { $sum : '$dll_allPax' }
			,dll_totalCallcenter : { $sum : '$dll_totalCallcenter' }
			,dll_totalCallcenterCC : { $sum : '$dll_totalCallcenterCC' }
			,dll_totalCallcenterPP : { $sum : '$dll_totalCallcenterPP' }
			,dll_totalCallcenterCK : { $sum : '$dll_totalCallcenterCK' }
			,dll_paxCallcenter : { $sum : '$dll_paxCallcenter' }
			,dll_paxCallcenterCC : { $sum : '$dll_paxCallcenterCC' }
			,dll_paxCallcenterPP : { $sum : '$dll_paxCallcenterPP' }
			,dll_paxCallcenterCK : { $sum : '$dll_paxCallcenterCK' }
			,dll_totalWeb : { $sum : '$dll_totalWeb' }
			,dll_totalWebCC : { $sum : '$dll_totalWebCC' }
			,dll_totalWebPP : { $sum : '$dll_totalWebPP' }
			,dll_totalWebCK : { $sum : '$dll_totalWebCK' }
			,dll_paxWeb : { $sum : '$dll_paxWeb' }
			,dll_paxWebCC : { $sum : '$dll_paxWebCC' }
			,dll_paxWebPP : { $sum : '$dll_paxWebPP' }
			,dll_paxWebCK : { $sum : '$dll_paxWebCK' }
			,mxn_all : { $sum : '$mxn_all' }
			,mxn_allPax : { $sum : '$mxn_allPax' }
			,mxn_totalCallcenter : { $sum : '$mxn_totalCallcenter' }
			,mxn_totalCallcenterCC : { $sum : '$mxn_totalCallcenterCC' }
			,mxn_totalCallcenterPP : { $sum : '$mxn_totalCallcenterPP' }
			,mxn_totalCallcenterCK : { $sum : '$mxn_totalCallcenterCK' }
			,mxn_paxCallcenter : { $sum : '$mxn_paxCallcenter' }
			,mxn_paxCallcenterCC : { $sum : '$mxn_paxCallcenterCC' }
			,mxn_paxCallcenterPP : { $sum : '$mxn_paxCallcenterPP' }
			,mxn_paxCallcenterCK : { $sum : '$mxn_paxCallcenterCK' }
			,mxn_totalWeb : { $sum : '$mxn_totalWeb' }
			,mxn_totalWebCC : { $sum : '$mxn_totalWebCC' }
			,mxn_totalWebPP : { $sum : '$mxn_totalWebPP' }
			,mxn_totalWebCK : { $sum : '$mxn_totalWebCK' }
			,mxn_paxWeb : { $sum : '$mxn_paxWeb' }
			,mxn_paxWebCC : { $sum : '$mxn_paxWebCC' }
			,mxn_paxWebPP : { $sum : '$mxn_paxWebPP' }
			,mxn_paxWebCK : { $sum : '$mxn_paxWebCK' }
		};
		var $projectCompany = {
			company:1,fee:1,feeKids:1,pax:1,kidPax:1,state:1,hotel:1,reservation_method:1,payment_method:1,currency:1
			,totalNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },feeSumVar,0 ] }
			,paxNeto 	: { $cond : [ { $ne : ['$state' , 'canceled'] },paxSumVar,0 ] }
			//faltaría agregar validación por DLL global
			,dll_all : { $cond : [ conditions.dll.dllAll ,feeSumVar,0 ] }
			,dll_allPax : { $cond : [ conditions.dll.dllAll ,paxSumVar,0 ] }
			,dll_totalCallcenter : { $cond : [ conditions.dll.callcenter ,feeSumVar,0 ] }
			,dll_totalCallcenterCC : { $cond : [ conditions.dll.callcenterCreditcard ,feeSumVar,0 ] }  
			,dll_totalCallcenterPP 	: { $cond : [ conditions.dll.callcenterPaypal ,feeSumVar,0 ] } 
			,dll_totalCallcenterCK 	: { $cond : [ conditions.dll.callcenterConekta ,feeSumVar,0 ] } 
			,dll_paxCallcenter 	: { $cond : [ conditions.dll.callcenter ,paxSumVar,0 ] } 
			,dll_paxCallcenterCC 	: { $cond : [ conditions.dll.callcenterCreditcard ,paxSumVar,0 ] } 
			,dll_paxCallcenterPP 	: { $cond : [ conditions.dll.callcenterPaypal ,paxSumVar,0 ] } 
			,dll_paxCallcenterCK 	: { $cond : [ conditions.dll.callcenterConekta ,paxSumVar,0 ] } 
			,dll_totalWeb : { $cond : [ conditions.dll.web ,feeSumVar,0 ] }
			,dll_totalWebCC : { $cond : [ conditions.dll.webCreditcard ,feeSumVar,0 ] }  
			,dll_totalWebPP 	: { $cond : [ conditions.dll.webPaypal ,feeSumVar,0 ] } 
			,dll_totalWebCK 	: { $cond : [ conditions.dll.webConekta ,feeSumVar,0 ] } 
			,dll_paxWeb 	: { $cond : [ conditions.dll.web ,paxSumVar,0 ] } 
			,dll_paxWebCC 	: { $cond : [ conditions.dll.webCreditcard ,paxSumVar,0 ] } 
			,dll_paxWebCK 	: { $cond : [ conditions.dll.webConekta ,paxSumVar,0 ] } 
			,dll_paxWebCK 	: { $cond : [ conditions.dll.webConekta ,paxSumVar,0 ] } 
			//faltaría agregar validación por MXN global
			,mxn_all : { $cond : [ conditions.mxn.mxnAll ,feeSumVar,0 ] }
			,mxn_allPax : { $cond : [ conditions.mxn.dllAll ,paxSumVar,0 ] }
			,mxn_totalCallcenter : { $cond : [ conditions.mxn.callcenter ,feeSumVar,0 ] }
			,mxn_totalCallcenterCC : { $cond : [ conditions.mxn.callcenterCreditcard ,feeSumVar,0 ] }  
			,mxn_totalCallcenterPP 	: { $cond : [ conditions.mxn.callcenterPaypal ,feeSumVar,0 ] } 
			,mxn_totalCallcenterCK 	: { $cond : [ conditions.mxn.callcenterConekta ,feeSumVar,0 ] } 
			,mxn_paxCallcenter 	: { $cond : [ conditions.mxn.callcenter ,paxSumVar,0 ] } 
			,mxn_paxCallcenterCC 	: { $cond : [ conditions.mxn.callcenterCreditcard ,paxSumVar,0 ] } 
			,mxn_paxCallcenterPP 	: { $cond : [ conditions.mxn.callcenterPaypal ,paxSumVar,0 ] } 
			,mxn_paxCallcenterCK 	: { $cond : [ conditions.mxn.callcenterConekta ,paxSumVar,0 ] } 
			,mxn_totalWeb : { $cond : [ conditions.mxn.web ,feeSumVar,0 ] }
			,mxn_totalWebCC : { $cond : [ conditions.mxn.webCreditcard ,feeSumVar,0 ] }  
			,mxn_totalWebPP 	: { $cond : [ conditions.mxn.webPaypal ,feeSumVar,0 ] } 
			,mxn_totalWebCK 	: { $cond : [ conditions.mxn.webConekta ,feeSumVar,0 ] } 
			,mxn_paxWeb 	: { $cond : [ conditions.mxn.web ,paxSumVar,0 ] } 
			,mxn_paxWebCC 	: { $cond : [ conditions.mxn.webCreditcard ,paxSumVar,0 ] } 
			,mxn_paxWebPP 	: { $cond : [ conditions.mxn.webPaypal ,paxSumVar,0 ] } 
			,mxn_paxWebCK 	: { $cond : [ conditions.mxn.webConekta ,paxSumVar,0 ] } 
		};
		Reservation.native(function(err,theReservation){
			//en este agregate tenemos los globales (posiblemente innecesario) y las compañias (lo más importante)
			theReservation.aggregate([ { $sort : { createdAt : -1 } }, { $match : $match }, { $project : $projectGral }, { $group : $groupGral } ],function(err,resultsGlobal){ 
				if(err || resultsGlobal.length==0) return cb(false,err);
				resultsGlobal = resultsGlobal[0];
				if( !resultsGlobal.companyIDs )  return cb(false,{ err: 'no results' });
				var companyIDs = _.map(resultsGlobal.companyIDs, function(x){ return x.toString(); });
				companyIDs = _.uniq(companyIDs);
				async.mapSeries( companyIDs, function(item,theCB){
					Company.findOne(item).exec(function(err,thisCompany){
						if(err||!thisCompany) return theCB(err,false);
						$match.company = sails.models['company'].mongo.objectId( item );
						//se tendría que hacer 3 veces este aggregate para validar lo de las fechas 
						theReservation.aggregate([ { $sort : { createdAt : -1 } }, { $match : $match }, { $project : $projectCompany }, { $group : $groupCompany }  ],function(err,resultsCompany1){ 
							if(err || resultsCompany1.length==0) return theCB(err,false);
							resultsCompany1 = resultsCompany1[0];
							//console.log('111111111111111111111111111111111111111111111111111111111111111111111111111111111',resultsCompany1);
							var aux = {
								company : thisCompany.name
								,description : 'Resultados totales'
								,pax : resultsCompany1.pax
								,total : resultsCompany1.total
								,quantity : 1
								,type:'c'
								,rows2 : getAllTotalsByAgency([],resultsCompany1)
							};
							//el match va a cambiar para validar que un serivicio haya sido dado o no
							$match2 = $match;
							$match2.$or = [
								{ $and : [ { type : 'one_way' }, { origin : 'airport' } ,{ arrival_date : { $ne : null } },{ arrival_date : { $ne:'' } },{ arrival_date : { $lte : new Date() } } ]}
								,{ $and : [ { type : 'one_way' }, { origin : 'hotel' } ,{ departure_date : { $ne : null } },{ departure_date : { $ne:'' } },{ departure_date : { $lte : new Date() } } ]}
								,{ $and : [  { type : 'round_trip' }  ,{ arrival_date : { $ne:null } } ,{ arrival_date : { $ne:'' } } ,{ arrival_date : { $lte : new Date() } } ]} ];
							theReservation.aggregate([ { $sort : { createdAt : -1 } }, { $match : $match2 }, { $project : $projectCompany }, { $group : $groupCompany }  ],function(err,resultsCompany2){ 
								if(!err&&resultsCompany2.length>0){
									resultsCompany2 = resultsCompany2[0];
									//console.log('22222222222222222222222222222222222222222222222222222222222222222222222222',resultsCompany2);
									aux.rows2.push({ company:'',description:'Reservas Completadas',pax:'',total:'',quantity:'',type:'c' });
									aux.rows2 = getAllTotalsByAgency(aux.rows2,resultsCompany2);
								}
								$match2.$or = [
									{ $and : [ { type : 'one_way' }, { origin : 'airport' }, { arrival_date : { $ne : null } },{ arrival_date : { $ne:'' } },{ arrival_date : { $gt : new Date() } } ] }
									,{ $and : [ { type : 'one_way' }, { origin : 'hotel' } ,{ departure_date : { $ne : null } },{ departure_date : { $ne:'' } },{ departure_date : { $gt : new Date() } } ] }
									,{ $and : [ { type : 'round_trip' }, { arrival_date : { $ne:null } } ,{ arrival_date : { $ne:'' } } ,{ arrival_date : { $gt : new Date() } } ] } ];
								theReservation.aggregate([ { $sort : { createdAt : -1 } }, { $match : $match2 }, { $project : $projectCompany }, { $group : $groupCompany }  ],function(err,resultsCompany3){ 
									if(!err&&resultsCompany3.length>0){
										resultsCompany3 = resultsCompany3[0];
										//console.log('33333333333333333333333333333333333333333333333333333333333333333333333',resultsCompany3);
										aux.rows2.push({ company:'',description:'Reservas NO Completadas',pax:'',total:'',quantity:'',type:'c' });
										aux.rows2 = getAllTotalsByAgency(aux.rows2,resultsCompany3);
									}
									theCB(false,aux);
								});//aggregate by company 3
							});//aggregate by company 2
						});//aggregate by company 1
					});
				},function(err,items){
					//agregar los resultados
					results.rows = items;
					results.totals.total = resultsGlobal.total;
					results.totals.iva = resultsGlobal.total*mainIVA;
					results.totals.subtotal = resultsGlobal.total - results.totals.iva;
					results.totals.pax = resultsGlobal.pax;
					results.reportType = 'bygroup';
					cb(results,err);
				});//async by companies
			});//global aggregate
		});//.native close
	});
};
function getCurrencies(cb){
	Currency.find({ currency_code : ['USD','MXN'] }).exec(function(err,currencies){
		console.log(err);
		if(err || !currencies || currencies.length==0 ) return cb(false);
		var r  = {};
		for(x in currencies){
			if( currencies[x].currency_code == 'USD' )
				r.usd = currencies[x];
			if( currencies[x].currency_code == 'MXN' )
				r.mxn = currencies[x];
		}
		return cb(r);
	});
}
function getAllTotalsByAgency(r,x){
	var y = [ //falta agregat global DLL y MXN
		{ t : 'dll_all', p : 'dll_allPax', q: 1, d : 'Total de Dólares' }
		,{ t : 'dll_totalCallcenter', p : 'dll_paxCallcenter', q: 1, d : 'Callcenter' }
		,{ t : 'dll_totalCallcenterCC', p : 'dll_paxCallcenterCC', q: 1, d : 'Callcenter Credit card' }
		,{ t : 'dll_totalCallcenterPP', p : 'dll_paxCallcenterPP', q: 1, d : 'Callcenter Paypal' }
		,{ t : 'dll_totalCallcenterCK', p : 'dll_paxCallcenterCK', q: 1, d : 'Callcenter Conekta' }
		,{ t : 'dll_totalWeb', p : 'dll_paxWeb', q: 1, d : 'Web' }
		,{ t : 'dll_totalWebCC', p : 'dll_paxWebCC', q: 1, d : 'Web Credit card' }
		,{ t : 'dll_totalWebPP', p : 'dll_paxWebPP', q: 1, d : 'Web Paypal' }
		,{ t : 'dll_totalWebCK', p : 'dll_paxWebCK', q: 1, d : 'Web Conekta' }
		,{ t : 'mxn_all', p : 'mxn_allPax', q: 1, d : 'Total de Pesos Mexicanos' }
		,{ t : 'mxn_totalCallcenter', p : 'mxn_paxCallcenter', q: 1, d : 'Callcenter' }
		,{ t : 'mxn_totalCallcenterCC', p : 'mxn_paxCallcenterCC', q: 1, d : 'Callcenter Credit card' }
		,{ t : 'mxn_totalCallcenterPP', p : 'mxn_paxCallcenterPP', q: 1, d : 'Callcenter Paypal' }
		,{ t : 'mxn_totalCallcenterCK', p : 'mxn_paxCallcenterCK', q: 1, d : 'Callcenter Conekta' }
		,{ t : 'mxn_totalWeb', p : 'mxn_paxWeb', q: 1, d : 'Web' }
		,{ t : 'mxn_totalWebCC', p : 'mxn_paxWebCC', q: 1, d : 'Web Credit card' }
		,{ t : 'mxn_totalWebPP', p : 'mxn_paxWebPP', q: 1, d : 'Web Paypal' }
		,{ t : 'mxn_totalWebCK', p : 'mxn_paxWebCK', q: 1, d : 'Web Conekta' }
	];
	for( i in y ){
		r.push({
			company : ''
			,description : y[i].d
			,pax : x[y[i].p]
			,total : x[y[i].t]
			,quantity : y[i].q
		});
	}
	return r;
};