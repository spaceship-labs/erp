module.exports.assignReservation = function(params,callback){
	var id = params.id;
	delete params.id;
	delete params.asign.id;
	params.asign.reservation = id;
	TransportAsign.create(params.asign).exec(function(err,asigned){
		if(err) return callback(err,false);
		delete params.asign;
		params.asign = asigned.id;
		Reservation.update({id:id},params,function(err,r){
			if(err) return callback(err,false);
			Reservation.findOne(id).populateAll().exec(callback);
		});
	});
};
module.exports.smallAssignReservation = function(asign,reservationID,callback){
	asign.reservation = reservationID;
	TransportAsign.create(asign).exec(function(err,asigned){
		if(err) return callback(err,false);
		var params = { asign : asigned.id };
		Reservation.update({id:reservationID},params,function(err,r){
			if(err) return callback(err,false);
			Reservation.findOne(reservationID).populateAll().exec(callback);
		});
	});
};
module.exports.formatFilterFields = function(f){
	var fx = { };
	fx['$or'] = [];
  for( var x in f ){
    if( f[x].model ){
      if( f[x].type == 'date' ){
      	var from = {}; from[f[x].field] = { '>=' : new Date(f[x].model.from) };
        var to = {}; to[f[x].field] = { '<=' : new Date(f[x].model.to) };
        if( f[x].options && f[x].options.oneDate ){
        	var field = {};
        	field[f[x].field] = f[x].model.from;
        	fx['$or'].push(field);
        }else{
        	if( f[x].field == 'arrival_date' ){
	          fx['$or'] = [ 
	            { $and : [ from, to ] }, 
	            { $and : [ { startDate : { '$gte' : new Date(f[x].model.from) } }, { startDate : { '$lte' : new Date(f[x].model.to) } } ] }, 
	            { $and : [ { cancelationDate : { '$gte' : new Date(f[x].model.from) } }, { cancelationDate : { '$lte' : new Date(f[x].model.to) } } ] }
	            ]
	        }else{
	          fx['$and'] = [from,to];
	        }
        }
        //fx['$or'].push({ $and : [ from, to ] });
        //fx['$or'].push({ field : { '=' : new Date(f[x].model.from) } });
        //fx['$or'].push({ field : { '=' : new Date(f[x].model.to)   } });
        /*if( f[x].field == 'arrival_date' ){
          fx['$or'] = [ 
            { $and : [ from, to ] }, 
            { $and : [ { startDate : { '>=' : new Date(f[x].model.from) } }, { startDate : { '<=' : new Date(f[x].model.to) } } ] }, 
            { $and : [ { cancelationDate : { '>=' : new Date(f[x].model.from) } }, { cancelationDate : { '<=' : new Date(f[x].model.to) } } ] }
            ]
        }else{
          fx['$and'] = [from,to];
        }*/
      }else if( f[x].type == 'autocomplete' ){
          fx[ f[x].field ] = f[x].model.item.id;
      }else if( f[x].type == 'select' || f[x].type == 'text' || f[x].type == 'number' ){
          fx[ f[x].field ] = f[x].type=='number'?parseInt(f[x].model.item):f[x].model.item;
      }
    }
  }
  //console.log(fx['$or']);
  if( fx['$or'].length == 0 ) delete fx['$or'];
  return fx;
};
module.exports.divideReservations = function(reservations){
	var result = { asigned : [] , notAsigned : [] };
	for( var x in reservations ){
		if( reservations[x].asign )
			result.asigned.push( reservations[x] );
		else
			result.notAsigned.push( reservations[x] );
	}
	return result
}
module.exports.getReservationsDivided = function(params,user,callback){
	//configurar parámetros
	var skip = params.skip || 0;
    var limit = params.limit || 100;
	params.fields = AssignCore.formatFilterFields(params.fields);
	params.conditions = {};
	if( !user.company.adminCompany && user.company.company_type == 'transport' ){
		params.ta = { company : sails.models['company'].mongo.objectId(user.company.id) };
		AssignCore.getReservationsByTransportist(params,function(err,reservations){
			return callback(err, AssignCore.divideReservations(reservations) );
		});
	}else{
		if( !user.company.adminCompany && user.company.company_type == 'agency' )
	        params.conditions.company = user.company.id;
		var conditions = params.conditions;
		Reservation.find(conditions).where(params.fields).populateAll().limit(limit).skip(skip).exec(function(err,reservations){
			return callback(err, AssignCore.divideReservations(reservations) );
		});
	}
};
module.exports.getReservationsByTransportist = function(params,callback){
	var skip = params.skip || 0;
    var limit = params.limit || 100;
	var $match = params.ta || {};
	var $groupGral = {
		_id : null
		,reservationsIDs : { '$push' : '$reservation' }
	};
	delete params.ta;
	TransportAsign.native(function(err,TA){
		TA.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $group : $groupGral } 
		],function(err,tas){ 
			tas = tas[0];
			params.fields.id = tas.reservationsIDs;
			Reservation.find().where(params.fields).populateAll().limit(limit).skip(skip).exec(function(err,reservations){
				return callback(err,reservations);
			});
		});
	});
}
/*
	Entre los parámetros debe de recibir siempre: 
		company : Transportista de la cual queremos obtener los vehículos
		transfer : Servicio que se va a llevar a cabo para obtener los vehículos posibles
*/
module.exports.getVehicles = function(params,callback){
	Transfer.findOne(params.transfer).populateAll().exec(function(err,transfer){
		if( err ) return callback(err,false);
		//transporttypes ->estos tienen los vehículos
		var condiciones = {
			$or : [
				{ transfer : params.transfer.id || params.transfer }
				,{ transfers : params.transfer.id || params.transfer }
			]
		}
		//console.log(condiciones);
		TransportType.find(condiciones).populateAll().exec(function(err,types){
			//console.log(types.transports.length);
			var vehicles = [];
			for(var x in types){
				for(var y in types[x].transports){
					var aux = Common.getIndexById(types[x].transports[y].id,vehicles);
					if( aux < 0 ){
						var vehicle = types[x].transports[y];
						vehicle.transfer = types[x].transfer.id==params.transfer?types[x].transfer:false;
						vehicle.transfertype = types[x].name;
						vehicle.transfers = [];
					}else if( vehicles[aux] && !vehicles[aux].transfer && types[x].transfer.id==params.transfer ){
						var vehicle = vehicles[aux];
						vehicle.transfer = types[x].transfer;
						vehicle.transfertype = types[x].name;
						for(var z in types[x].transfers)
							if( vehicle.transfers.indexOf(types[x].transfers[z].id) == -1 )
								vehicle.transfers.push( types[x].transfers[z].id );
					}
					for(var z in types[x].transfers)
						if( types[x].transfers[z] && vehicle.transfers.indexOf(types[x].transfers[z].id) == -1 )
							vehicle.transfers.push( types[x].transfers[z].id );
					if( aux < 0 && vehicle ) vehicles.push(vehicle);
					else if(vehicles[aux]) vehicles[aux] = vehicle;
				}
			}
			return callback(false,vehicles);
		});
	});
};
var moment = require('moment-timezone');
module.exports.exportCSV = function(params,theCB){
	var name = 'Export operation -' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
	var $match = AssignCore.formatFilterFields(params);
	//$match.reservation_type = 'transfer';
	console.log($match);
	Reservation.find().where( $match ).populateAll()
	.exec(function(r_err,list_reservations){
		if(r_err) return theCB(r_err,[]);
		var toCSV = [];
		toCSV.push(['Fecha','Vuelo (salida)','Vuelo (llegada)','Cuenta?','Cliente','Hotel','Clave','Servicio','Pax','Agencia','Hora (salida)','Hora (llegada)','Unidad (salida)','Unidad (llegada)','Notas']);
		if( list_reservations ){ 
			async.mapSeries( list_reservations, function(item,cb){
				if( !item.asign ) return cb( false, item );
				TransportAsign.findOne(item.asign.id).populateAll().exec(function(err,ta){
					item.asign = ta;
					item = AssignCore.FormatItemToExport(item);
					toCSV.push(item);
					cb( err, item );
				});
			},function(err,rows){
				//results
				return theCB(err,toCSV);
			});
		}else{ //if reservations END
			return theCB({err:'no reservations'},toCSV);
		}
	});//reservation find END
};
module.exports.FormatItemToExport = function(reservation){
	var i = 0;
	var item = [];
	item[i] = moment(reservation.createdAt).format('D-MM-YYYY');
	item[++i] = reservation.departure_fly?(reservation.departure_fly + ' / ' + reservation.departure_airline.name):'';
	item[++i] = reservation.arrival_fly?(reservation.arrival_fly + ' / ' + reservation.arrival_airline.name):'';
	item[++i] = 'Cuenta';
	item[++i] = reservation.client.name; //cliente
	item[++i] = reservation.hotel.name; //hotel
	item[++i] = reservation.clave; //clave
	item[++i] = reservation.transfer.name; //servicio
	item[++i] = reservation.pax + ( reservation.kidPax || 0 ); //pax
	item[++i] = reservation.company.name; //Agencia
	item[++i] = reservation.asign.departurepickup_time?moment(reservation.asign.departurepickup_time).format('HH:mm'):'';
	item[++i] = reservation.asign.arrivalpickup_time?moment(reservation.asign.arrivalpickup_time).format('HH:mm'):'';
	item[++i] = reservation.asign.vehicle_departure?reservation.asign.vehicle_departure.car_id:'';
	item[++i] = reservation.asign.vehicle_arrival?reservation.asign.vehicle_arrival.car_id:'';
	item[++i] = reservation.notes; //notas
	return item;
};
module.exports.getObject = function(row,type){
	var result = {};
	var direccion = row.destiny=='tour'||row.destiny=='aeropuerto'?'salida':'llegada';
	if( type == 'reservation' ){
		result.hotel = row.hotel;
		//result.service = row[5];
		result.transfer = row.service;
		result.pax = row.pax;
		result.company = row.agency;
		result.type = 'one_way';
		//default data
		result.reservation_method = 'intern';
		result.reservation_type = 'transfer';
		result.state = 'liquidated';//{ handle : 'liquidated' };
		result.payment_method = 'creditcard';//{ handle : 'creditcard' };
		//end default data
		if( direccion == 'llegada' ){
			result.origin = 'airport';
			result.arrival_date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
			result.arrival_time = moment(row.time).format('YYYY-MM-DD HH:mm:ss');
			//console.log(result.arrival_time);
			//console.log(result.departure_time);
			result.arrival_fly = row.fly;
			result.arrival_airline = row.airline;
		}else{
			result.origin = 'hotel';
			result.departure_date = moment(row.date).format('YYYY-MM-DD HH:mm:ss');
			result.departure_time = moment(row.time).format('YYYY-MM-DD HH:mm:ss');
			result.departure_fly = row.fly;
			result.departure_airline = row.airline;
		}
	}
	if( type == 'client' ){
		result.name = row.client
	}
	if( type == 'asign' ){
		result.company = row.vehicle.company;
		if( direccion == 'llegada' ){
			result.vehicle_arrival = row.vehicle;
		}else{
			result.vehicle_departure = row.vehicle;
		}
	}
	return result;
}
/*
	Esta función formatea el archivo de excel (OPERACIÓN) quer recibe para generar las reservas
*/
module.exports.importOperation = function(err,book,req,callback){
	if(err) return callback(err,false);
	if( !book.sheets ) return callback({message:'no rows'},false);
	var columns = ['fly','airline','client','origin','destiny','service','pax','agency','time','vehicle','date','folioAgency','balancedll','balancemxn','operador'];
	book.sheets[0].values.splice(0,1);
	var defaultCompany = req.session.select_company || req.user.select_company;
	var errorRegisters = [];
	async.mapSeries( book.sheets[0].values, function(item,cb){
		//0 llegada o salida?,vuelo, airline, cliente, hotel, servicio, pax, agencia, hora, unidad
		var item2 = {};
		for(x in item) item2[ columns[x] ] = item[x]&&item[x]!=''&&(typeof item[x] == 'string')?item[x].toLowerCase():item[x];
		if( !item2.vehicle && !item2.service ) return cb(false,{});
		var adf = {};
		if( item2.service == 'tour' || item2.origin != 'aeropuerto' )
			adf.hotel = function(done){ Hotel.findOne({ name : item2.origin }).exec(done); };
		else if( item2.origin == 'aeropuerto' )
			adf.hotel = function(done){ Hotel.findOne({ name : item2.destiny }).exec(done); };
		if( item2.service == 'tour' )
			adf.tour = function(done){ Tour.findOne({ name : item2.destiny }).exec(done); }
		if( item2.airline != '' )
			adf.airline = function(done){ Airline.findOne({ name : item2.airline }).exec(done); };
		if( item2.service != 'tour' ){
			adf.service = function(done){ 
				colectivos = ['bshare','directo','group'];
				colectivosTypes = { bshare : 'B', directo : 'D', group : 'G' };
				item2.service = item2.service;
				if( colectivos.indexOf( item2.service ) >= 0 ){
					item2.service_type = colectivosTypes[ item2.service ];
					item2.service = 'colectivo';
				}else{
					item2.service_type = 'C';
				}
				Transfer.findOne({ name : item2.service }).exec(done); 
			};
		}
		if( item2.agency != '' )adf.agency = function(done){ Company.findOne({ name : item2.agency }).exec(done); };
		if( item2.vehicle != '' )
			adf.unidad = function(done){ Transport.findOne({ car_id : (item2.vehicle+'') }).populateAll().exec(done); };
		async.parallel(adf, function(err, search){
        	item2.airline = search.airline || '';
        	item2.hotel = search.hotel;
        	item2.service = search.service || item2.service;
        	item2.agency = search.agency || defaultCompany;
        	item2.vehicle = search.unidad || item2.vehicle;
        	//console.log('------------item',item2);
        	if(err || !(item2.hotel && item2.agency && item2.vehicle) )
        		return cb(err&&{search:search,item:item2},false);
			OrderCore.getCompanies(item2.agency.id,function(err,companies){
				if(err) return cb(false,false);
				console.log('COMPANIES ERR',err);
				item2.agency = companies.company;
				var r  = AssignCore.getObject(item2,'reservation');
				var c  = AssignCore.getObject(item2,'client');
				var ta = AssignCore.getObject(item2,'asign');
				Client_.create(c).exec(function(err,client){ 
					Exchange_rates.find().limit(1).sort({createdAt:-1}).exec(function(err,theExhangeRates){
						r.globalRates = theExhangeRates.rates;
						r.user = req.user.id;
						r.client = client.id;
						r.currency = r.company.base_currency || companies.mainCompany.base_currency;
						console.log('THE R',r);
						if( item2.service == 'tour' ) r.reservation_type = 'transfer_tour';
						if( item2.service != 'tour' ) //en el caso de las reservas de transportación
							AssignCore.createTransferReservationByImport(req,r,ta,client,companies,cb);
						else //en el caso de las reservas de tours
							AssignCore.createTourTransferReservationByImport(req,item2,r,ta,client,cb);
					});//getTransferPrice
				});//create client
			});
        });
	},function(err,rows){
		//results
		console.log('GLOBAL ERR:',err);
		console.log('end');
		return callback(err,rows);
	});
};
/*
	Selecciona el precio correspondiente al tour y el pax
*/
module.exports.createTourTransferReservationByImport = function(req,item2,r,ta,c,cb){
	//Select Price: depende del pax y del tour
	if( !item2.tour.extra_prices ) return cb('no tour price',false);
	var price = false;
	for(x in item2.tour.extra_prices)
		if( item2.tour.extra_prices[x].pax == r.pax )
			price = item2.tour.extra_prices[x];
	if( !price ) return cb('no tour price',false);
	
};
/*  Obtiene los precios y los agrega a la reservación (r), 
	luego llama a la función adecuada para generar la reserva
	req 		: request var of the system
	r 			: reservation object
	ta 			: transfer asign object
	c 			: client object
	companies 	: company and maincompany(if necesary)
	cb 			: callback 
*/
module.exports.createTransferReservationByImport = function(req,r,ta,c,companies,cb){
	Location.findOne(r.hotel.location).populate('airportslist').exec(function(err,hotelLocation){
		if( err || !hotelLocation.airportslist || hotelLocation.airportslist.length == 0 ) return cb(err,false);
		var airport = hotelLocation.airportslist[0];
		if( err || !airport ) return cb(err,false);
		OrderCore.getTransferPrice(airport.zone,r.hotel.zone,r.transfer.id,companies.company.id,companies.mainCompany,function(err,prices){
			console.log('PRICES ERR:',err);
			if(err||!prices||!prices.price) return cb({message:'no price found'},false);//price contiene price y mainPrice para agregar a la reser
			r.airport = airport.id;
			r.service_type = prices.price.transfer.service_type || 'C' ;
			r.quantity = Math.ceil( r.pax / prices.price.transfer.max_pax );
	        r.fee = prices.price[r.type] * r.quantity;
	        r.fee_adults = prices.price.one_way;
			r.fee_adults_rt = prices.price.round_trip;
			r.fee_kids = prices.price.one_way_child;
			r.fee_kids_rt = prices.price.round_trip_child;
			if( companies.company.exchange_rates && companies.company.exchange_rates[r.currency] ){
				r.exchange_rate_sale = companies.company.exchange_rates[r.currency].sales;
            	r.exchange_rate_book = companies.company.exchange_rates[r.currency].book;
			}else{
				r.exchange_rate_sale = companies.mainCompany.exchange_rates[r.currency].sales;
            	r.exchange_rate_book = companies.mainCompany.exchange_rates[r.currency].book;
			}
			if( companies.mainCompany && prices.mainPrice ){
				r.main_fee_adults 		= prices.mainPrice.one_way;
				r.main_fee_adults_rt 	= prices.mainPrice.round_trip;
				r.main_fee_kids 		= prices.mainPrice.one_way_child;
				r.main_fee_kids_rt 	= prices.mainPrice.round_trip_child;
			}
			AssignCore.createReservationByImport(r,ta,req,cb);
		});//Exchange_rates
	});
};
module.exports.createReservationByImport = function(r,ta,req,cb){
	r.company = r.company.id;
	r.hotel = r.hotel.id;
	r.transfer = r.transfer.id;
	r.airline = r.airline&&r.airline!=''?r.airline.id:r.airline;
	var params2 = { company : r.company, client : r.client };
	//console.log('params2 cre',params2)
	OrderCore.createOrder(params2,req,function(err,order){
		Order.findOne( order.id ).exec(function(err,order){
			r.order = order.id;
			r.folio = order.folio;
			console.log('RESERVATION: ', r.order, r.folio);
			Reservation.create(r).exec(function(err,reservation){
	    		if(err) return cb(err,false);
	    		order.reservations.add(reservation.id);
	    		order.state = reservation.state;
	    		order.save(function(err){
	      			AssignCore.smallAssignReservation(ta,reservation.id,cb);
	    		});
	  		});//Reservation create
		});//order findone
	});//create order
};
module.exports.getTransferPrice = function(company,zone1,zone2,transfer,callback){
	TransferPrice.findOne({
      company : company.id
      ,active : true
      ,transfer : transfer.id
      //,type : { $ne : 'provider' }
      ,$or :[ 
        { $and : [{zone1 : zone1, zone2 : zone2}] } , 
        { $and : [{zone1 : zone2, zone2 : zone1}] } 
      ] 
    }).populate('transfer').exec(callback);
}
module.exports.customGetAvailableTransfers = function(company,params){
  //console.log('company');console.log(company);
  //if(company.adminCompany){
    TransferPrice.find({ 
      company : company.id
      ,active : true
      //,type : { '$ne' : 'provider' }
      ,"$or":[ 
        { "$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] } , 
        { "$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] } 
      ] 
    }).populate('transfer').exec(function(err,prices){
    	if(err) return false;
    	return prices
    });
  /*}else{
    CompanyProduct.find({agency : company.id,product_type:'transfer'}).exec(function(cp_err,products){
      var productsArray = [];
      for(var x in products) productsArray.push( products[x].transfer );
      TransferPrice.find({ 
        company : company.id
        ,active : true
        ,transfer : productsArray
        ,"$or":[ 
          { "$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] } , 
          { "$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] } 
        ] 
      }).populate('transfer').exec(function(err,prices){
      	if(err) return false;
    	return prices
      });
    });
  }*/
}
/*
	SERVICIOS de la operacion
Colectivo
Colectivo por pax
Luxury hasta 6 pax
privado 1-4 pax
privado 1-8 pax
privado 9-16 pax
privado por pax
*/