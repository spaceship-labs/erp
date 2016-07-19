var moment = require('moment-timezone');


module.exports.getCancelationMotives = function(){
	var result = [
		'Mal tiempo'
		,'Mal servicio (proveedor)'
		,'No es lo que me vendieron (vendedor)'
		,'Otros'
	];
	return result;
};
/*
	Función temporal para asignar usuario: "Web user" a las reservas sin usuario de la página
*/
module.exports.asignUser = function(cb){
	//Order.update({ user: { $exists : true } },{ user: '56abb2dde136fdc555365997' }).exec(function(err,orders){ // as admin ¬¬
	//Order.update({ user: { $exists : false } },{ user: '5783c25d85528e0c27d6e05b' }).exec(function(err,orders){ // as web user
	/*Order.update({ currency: { $exists : false } },{ currency: '56abb299e136fdc555365983' }).exec(function(err,orders){ // add currency USD
		console.log('orders updated without user',err,orders.length);cb();
	});*/
	Order.find().populate('reservations').exec(function(err,os){
		async.mapSeries( os, function(o,cb2) {
				if(!o.reservations||(o.reservations&&o.reservations.length==0)) return cb2(o);
				o.payment_method = o.reservations[0].payment_method;
				o.save(cb2);
		},function(err,r){
			cb();
		});
	});
};
/*
	Create section 
		create order
		create reservations transfers and tours/hotels
*/
module.exports.createOrder = function(params, req , callback){
    params.user = req.user.id;
    params.company = params.company?params.company:(req.session.select_company || req.user.select_company);
    params.reservation_method = 'intern';
    params.req = req;
    params.reservations = [];
    delete params.id;
    OrderCore.validateCupon( params.token, function(err,cupon,single){
    	delete params.token;
    	if( single ) params.cuponsingle = single.id;
    	if( cupon ) params.cupon = cupon.id;
    	console.log(err);
    	console.log(cupon);
    	Order.create(params).exec(callback);
    });
};
module.exports.createTransferReservation = function(params, defaultUserID, defaultCompany, callback){
	Order.findOne(params.order).exec(function(e,theorder){
		if(e) return callback(e,false);
		params.hotel = params.hotel.id || params.hotel;
	    params.state = params.state?(params.state.handle || params.state):'liquidated';
	    params.payment_method = params.payment_method ? params.payment_method.handle||params.payment_method : 'creditcard';
	    params.airport = params.airport.id || params.airport;
	    params.client = params.client.id||params.client;
	    params.user = defaultUserID;
	    delete params.id;
	    theorder.company = theorder.company || defaultCompany;
	    OrderCore.getCompanies(theorder.company,function(err,companies){
	    	if(err) return callback(err,false);
	    	params.folio = theorder.folio;
	    	params.company = companies.company;
      		params.currency = params.currency?params.currency.id||params.currency:(params.company.base_currency?params.company.base_currency:companies.mainCompany.base_currency);
      		OrderCore.getTransferPrice(params.transferprice.zone1,params.transferprice.zone2,params.transfer,companies.company.id,companies.mainCompany,function(err,prices){
      			if(err) return callback(err,false);
      			Exchange_rates.find().limit(1).sort({createdAt:-1}).exec(function(err,theExhangeRates){
      				if(err) cb(err,item);
					theExhangeRates = theExhangeRates[0];
					//console.log('prices');
					//console.log(prices.price);
	      			params.service_type = prices.price.transfer.service_type || 'C' ;
	      			params.quantity = Math.ceil( params.pax / prices.price.transfer.max_pax );
	          		params.fee = prices.price[params.type] * params.quantity;
	          		//console.log(params.currency);
	          		//console.log(companies.company.base_currency);
	          		if( params.currency != companies.company.base_currency )
	            		params.fee *= companies.company.exchange_rates[params.currency].sales;
	            	//se guardan los precios que se están cobrando
					params.fee_adults = prices.price.one_way;
					params.fee_adults_rt = prices.price.round_trip;
					params.fee_kids = prices.price.one_way_child;
					params.fee_kids_rt = prices.price.round_trip_child;
					if( companies.company.exchange_rates && companies.company.exchange_rates[params.currency] ){
						params.exchange_rate_sale = companies.company.exchange_rates[params.currency].sales;
		            	params.exchange_rate_book = companies.company.exchange_rates[params.currency].book;
					}else{
						//console.log(companies.mainCompany.name);
						//console.log(companies.mainCompany.exchange_rates);
						//console.log(params.currency);
						params.exchange_rate_sale = companies.mainCompany.exchange_rates[params.currency].sales;
		            	params.exchange_rate_book = companies.mainCompany.exchange_rates[params.currency].book;
					}
					//en caso de que sea una reserva de agencia, guardar precios de la empresa principal
					if( companies.mainCompany && prices.mainPrice ){
						params.main_fee_adults 		= prices.mainPrice.one_way;
						params.main_fee_adults_rt 	= prices.mainPrice.round_trip;
						params.main_fee_kids 		= prices.mainPrice.one_way_child;
						params.main_fee_kids_rt 	= prices.mainPrice.round_trip_child;
					}
					params.globalRates = theExhangeRates.rates;
					delete params.generalFields;
					Reservation.create(params).exec(function(err,reservation){
	            		if(err) return callback(err,false);
	            		theorder.reservations.push(reservation.id);
	            		theorder.state = reservation.state;
	            		theorder.save(function(err){
	              			callback(err,reservation);
	            		});
	          		});//Reservation create
          		});//exchange rates
      		});//getTransferPrice
	    });//getCompanies
	});
};
module.exports.createReservationTourHotel = function(params,userID,callback){
	Order.findOne( params.order ).populate('company').populate('cupon').exec(function(err,theorder){
		if(err) callback(err,false);
		async.mapSeries( params.items, function(item,cb) {
			item.order = theorder.id;
	        item.company = theorder.company.id;
	        item.folio = theorder.folio;
	        item.user = userID;
	        item.payment_method = item.payment_method?item.payment_method.handle:(params.generalFields.payment_method?params.generalFields.payment_method.handle:'creditcard');
	        item.currency = params.currency?params.currency.id:theorder.company.base_currency;
	        item.autorization_code = item.autorization_code || params.generalFields.autorization_code || '';
	        item.state = item.state?item.state.handle:(params.generalFields.state?params.generalFields.state.handle:'pending');
	        console.log(theorder);
	        delete item.id;
			OrderCore.getTourAndPrices(item.reservation_type,item[item.reservation_type].id,theorder.company,function(err,products){
				Exchange_rates.find().limit(1).sort({createdAt:-1}).exec(function(err,theExhangeRates){
					if(err) cb(err,item);
					theExhangeRates = theExhangeRates[0];
					item = OrderCore.formatPrices(item,theorder,products,theExhangeRates);
					/*if( item.reservation_type ){
						item.fee_adults_base = products.item.fee_base;
						item.fee_kids_base = products.item.feeChild_base;
						if( theorder.company.adminCompany ){
							item.fee_adults = products.item.fee;
			                item.fee_kids = products.item.feeChild;
						}else if( products.agencyProduct ){
							item.fee_adults = products.agencyProduct.fee;
			                item.fee_kids = products.agencyProduct.feeChild;
			                item.commission_agency = products.item.commission_agency;
			                //main fees
			                item.main_fee_adults = products.item.fee;
			                item.main_fee_kids = products.item.feeChild;
						}
		                item.commission_sales = products.item.commission_sales;
		                item.exchange_rate_sale = theorder.company.exchange_rates[item.currency].sales;
		            	item.exchange_rate_book = theorder.company.exchange_rates[item.currency].book;
		                item.exchange_rate_provider = products.item.provider?products.item.provider.exchange_rate:0;
		                item.globalRates = theExhangeRates.rates;
	            	}
	            	if( OrderCore.validateCuponItems( products.item, theorder.cupon, item.reservation_type ) ){
	            		item.fee_adults *= theorder.cupon.gral_discount/100;
			            item.fee_kids *= theorder.cupon.gral_discount/100;
			            item.discount = theorder.cupon.gral_discount;
	            	}*/
	                item[item.reservation_type] = products.item.id;
	                delete item.generalFields;
	                Reservation.create(item).exec(function(err,r){
						if(err) cb(err,item);
						item.id = r.id; 
						cb(err,item);
					});
				});
			});
		},callback);
	});
};
module.exports.formatPrices = function( item, theorder, products, theExhangeRates ){
	if( item.reservation_type != 'transfer' ){
		//if( item.reservation_type ){
		item.fee_adults_base = products.item.fee_base;
		item.fee_kids_base = products.item.feeChild_base;
		if( theorder.company.adminCompany ){
			item.fee_adults = products.item.fee;
            item.fee_kids = products.item.feeChild;
            //calcular de nuevo los precios
            item.fee = item.pax * products.item.fee;
            item.feeKids = item.kidPax?item.kidPax * products.item.feeChild:0;
		}else if( products.agencyProduct ){
			item.fee_adults = products.agencyProduct.fee;
            item.fee_kids = products.agencyProduct.feeChild;
            item.commission_agency = products.item.commission_agency;
            //main fees
            item.main_fee_adults = products.item.fee;
            item.main_fee_kids = products.item.feeChild;
            //calcular de nuevo los precios
            item.fee = item.pax * products.agencyProduct.fee;
            item.feeKids = item.kidPax?item.kidPax * products.agencyProduct.feeChild:0;
		}
		if( item.currency != theorder.company.base_currency ){
            item.fee *= theorder.company.exchange_rates[item.currency].sales;
            item.feeKids *= theorder.company.exchange_rates[item.currency].sales;
        }
        item.commission_sales = products.item.commission_sales;
        item.exchange_rate_sale = theorder.company.exchange_rates[item.currency].sales;
    	item.exchange_rate_book = theorder.company.exchange_rates[item.currency].book;
        item.exchange_rate_provider = products.item.provider?products.item.provider.exchange_rate:0;
        item.globalRates = theExhangeRates.rates;
    	//}
    	//aplicar el descuento en caso de ser válido
    	if( OrderCore.validateCuponItems( products.item, theorder.cupon, item.reservation_type ) ){
    		item.fee *= theorder.cupon.gral_discount/100;
            item.feeKids *= theorder.cupon.gral_discount/100;
            item.discount = theorder.cupon.gral_discount;
            item.cuponsingle = theorder.cuponsingle;
    	}
	}
	return item;
}
module.exports.updateOrderDate = function(params,callback){
	var id = params.id;
	if( id && params.newDate ){
		Order.findOne(id).populate('reservations').exec(function(err,order){
			if(err){ callback(err,false); return; }
			order.createdAt = params.newDate;
			order.save(function(err,order_){
				if(err){ callback(err,false); return; }
				async.mapSeries( order.reservations, function(item,cb){
					Reservation.update({ id : item.id },{ createdAt : params.newDate },cb);
				},function(err,result){
					//console.log(order);
					callback(err,order);
				});
			});
		});
	}else{
		callback('No ID',false);
	}
};
module.exports.updateOrderParams = function(id,params,callback){
	if( !id || typeof id == 'undefined' || id == '' ) return callback('no id',false);
	var form = Common.formValidate(params,['state','payment_method','currency']);
	Order.findOne(id).exec(function(err,order){
		order.state = params.state;
		order.payment_method = params.payment_method;
		order.currency = params.currency;
		order.save(callback);
	});
	//Order.update({id:id},params,callback);
}
module.exports.cancelOrder = function(order,fields,callback){
	Order.findOne(order).populate('reservations').exec(function(err,theorder){
		if(err) callback(err,false);
		var cancelationDate = new Date();
		theorder.state = 'canceled';
		theorder.cancelationDate = cancelationDate;
		if( fields.motive ) theorder.motive = fields.motive;
		if( fields.others ) theorder.motiveOthers = fields.others;
		theorder.save(function(err,_order){
			async.mapSeries( theorder.reservations, function(item,cb) {
				item.state = 'canceled';
				item.cancelationDate = cancelationDate;
				if( fields.motive ) item.motive = fields.motive;
				if( fields.others ) item.motiveOthers = fields.others;
				item.save(cb);
			},callback);
		});
	});
};
module.exports.updateReservations = function(params,callback){
	items = params.items || [];
    async.mapSeries( items, function(item,cb) {
		var id = item.id;
		if( item.hotel )
			item.hotel = item.hotel.id;
		if( item.tour )
			item.tour = item.tour.id;
		if( item.client )
			item.client = item.client.id;
		delete item.id;
		delete item.flag_priceupdated;
		delete item.usePrice;
		delete item.useER;
		Reservation.update({id:id},item,function(err,r){
			cb(err,r);
		});
    },callback);
}
module.exports.getTourAndPrices = function(model,itemID,company,callback){
	model = model.toLowerCase();
	//el OR 'model' es porque falta hoteles por agencia
	if( company.adminCompany || model == 'hotel' ){
		sails.models[model].findOne(itemID).exec(function(err,theItem){
			callback( err, { item:theItem, agencyProduct: false } );
		});
	}else{
		CompanyProduct.findOne( item[model].id ).exec(function(err,CP){
			sails.models[model].findOne( CP[model].id ).populate('provider').exec(function(err,theItem){
				callback( err, { item:theItem, agencyProduct: CP } );
			});
		});
	}
};
module.exports.getCompanies = function(companyID,callback){
	Company.findOne(companyID).exec(function(err,company){
		if( company.adminCompany )
			callback(err,{ company : company, mainCompany : false });
		else{
			Company.findOne({adminCompany:true}).exec(function(err,mainCompany){
				callback(err,{ company : company, mainCompany : mainCompany });
			});
		}
	});
};
module.exports.getOrdersReservation = function(){}
/*
	Prices section:
		getAvailableTransfers
		getTransferPrice: obtiene el precio de cobro y el precio de la empresa principal
*/
module.exports.getTransferPrice = function(zone1,zone2,transfer,company,mainCompany,callback){
	mainCompany = mainCompany?mainCompany.id:false;
	TransferPrice.findOne({ company : company, active : true, transfer : transfer
      	,"$or" : [ 
        	{ "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
        	{ "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
      	] 
    }).populate('transfer').exec(function(err,price1){
    	if( company == mainCompany )
    		callback(err,{ price : price1, mainPrice: false });
    	else{
    		TransferPrice.findOne({ company : mainCompany, active : true, transfer : transfer
		      	,"$or" : [ 
		        	{ "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
		        	{ "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
		      	] 
		    }).populate('transfer').exec(function(err,mainPrice){
		    	callback(err,{ price : price1, mainPrice: mainPrice });
		    });
    	}
    });
};
module.exports.getAvailableTransfers = function(zone1,zone2,company,callback){
	//if(company.adminCompany){
	    TransferPrice.find({ 
	      company : company.id
	      ,active : true
	      ,"$or":[ 
	        { "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
	        { "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
	      ] 
	    }).populate('transfer').exec(callback);
	/*}else{
	    CompanyProduct.find({agency : company.id, product_type:'transfer'}).exec(function(cp_err,products){
	      var productsArray = [];
	      for(var x in products) productsArray.push( products[x].transfer );
	      TransferPrice.find({ 
	        company : company.id
	        ,active : true
	        ,transfer : productsArray
	        ,"$or":[ 
	          { "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
	          { "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
	        ] 
	      }).populate('transfer').exec(callback);
	    });
	}*/
};
/*
	Esta función de validar el cupón no valida que sea aplicable a los tours/hoteles/transfers
	sólo que esté vigente y regresa el cupón y el single
	- Este cupón aún no se ha usado como tal sino hasta que se cree la orden
*/
module.exports.validateCupon = function( token, cb ){
	//console.log( 'token' + token );
	if( !token || typeof token == 'undefined' || ( token && token == '' ) ){
		cb({msg:'no_token'},false,false);
		return;
	}
	CuponSingle.findOne({ token : token }).populate('orders').exec(function(err,single){
		if( err || !single ){ cb(err,false,false); return; }
		Cupon.findOne( single.cupon ).populateAll().exec(function(err,cupon){
			if( err || !cupon ){ cb(err,false,false); return; }
			var expDate1 = new Date( cupon.expirationDate );
			var expDate2 = new Date( single.expiration );
			var today = new Date();
			//console.log(expDate1);console.log(expDate2);console.log(today);
			if( ( single.multiple && single.orders.length < single.times ) || ( !single.multiple && single.orders.length == 0 ) )
				if( ( cupon.perpetuo || expDate1 >= today) && expDate2 >= today )
					cb(false,cupon,single);
				else
					cb({msg:'expired'},false,false);
			else
				cb({msg:'max_times'},false,false);
		});
	});
}
/*
	Aquí se debe de validar por cada reservación si es válido para el tour/hotel/traslado
	si, de aquí pasa entonces se plicará el descuento y se guardará el cuponsingle en la orden, 
	sino se usarán los precios 
*/
module.exports.validateCuponItems = function( item, cupon, type ){
	if( cupon ){
		type = type=='tour'?'tours':type;
		type = type=='hotel'?'hotels':type;
		type = type=='transfer'?'transfers':type;
		if( type == 'tours' && cupon.allTours ) return true;
		if( type == 'hotels' && cupon.allHotels ) return true;
		if( type == 'transfers' && cupon.allTransfers ) return true;
		for( var x in cupon[type] )
			if( cupon[type][x].id == item.id )
				return true;
	}
	return false;
};
/*Import functions*/
/*
	Esta función formatea el archivo de excel (OPERACIÓN) quer recibe para generar las reservas
*/
module.exports.importOperation = function(err,book,req,callback){
	if(err) return callback(err,false);
	if( !book.sheets ) return callback({message:'no rows'},false);
	var columns = ['airline','client','origin','destiny','service','pax','date','time','fly','notes','agency'];
	book.sheets[0].values.splice(0,1);
	var defaultCompany = req.session.select_company || req.user.select_company;
	var errorRegisters = [];
	async.mapSeries( book.sheets[0].values, function(item,cb){
		var item2 = {};
		for(x in item) item2[ columns[x] ] = item[x]&&item[x]!=''&&(typeof item[x] == 'string')?item[x].toLowerCase():item[x];
		item.unshift('');
		if( !item2.service ){ 
			item2._err = 'Serivicio requerido';
			return cb(false,item2);
		}
		var adf = {};
		if( item2.service == 'tour' || item2.origin != 'aeropuerto' )
			adf.hotel = function(done){ Hotel.findOne({ name : item2.origin }).exec(done); };
		else if( item2.origin == 'aeropuerto' )
			adf.hotel = function(done){ Hotel.findOne({ name : item2.destiny }).exec(done); };
		//if( item2.service == 'tour' ) adf.tour = function(done){ Tour.findOne({ name : item2.destiny }).exec(done); }
		if( item2.airline != '' )
			adf.airline = function(done){ Airline.findOne({ name : item2.airline }).exec(done); };
		if( item2.service != 'tour' )
			adf.service = function(done){ Transfer.findOne({ name : item2.service }).exec(done); };
		if( item2.agency != '' )
			adf.agency = function(done){ Company.findOne({ name : item2.agency }).exec(done); };
		async.parallel(adf, function(err, search){
        	item2.airline = search.airline || '';
        	item2.hotel = search.hotel;
        	item2.service = search.service || item2.service;
        	item2.agency = search.agency || defaultCompany;
        	//console.log('------------item',item2);
        	if(err){
        		//item._err = "error en busqueda, revisar datos";
        		item[0] = "error en busqueda, revisar datos";
        		return cb(false,item);
        	}
        	if(!item2.hotel ){
        		//item._err = "No se encontró hotel en la base de datos";
        		item[0] = "No se encontró hotel en la base de datos";
        		return cb(false,item);
        	}
        	if( !item2.agency ){
        		//item._err = "No se encontró agencia en la base de datos";
        		item[0] = "No se encontró agencia en la base de datos";
        		return cb(false,item);
        	}
			OrderCore.getCompanies(item2.agency.id,function(err,companies){
				if(err){
					console.log('COMPANIES ERR',err);
        			//item2._err = ;
        			item[0] = "No se encontró agencia en la base de datos";
        			return cb(false,item);
        		}
				item2.agency = companies.company;
				var r  = OrderCore.getObject(item2,'reservation');
				var c  = OrderCore.getObject(item2,'client');
				Client_.create(c).exec(function(err,client){ 
					Exchange_rates.find().limit(1).sort({createdAt:-1}).exec(function(err,theExhangeRates){
						r.globalRates = theExhangeRates.rates;
						r.user = req.user.id;
						r.client = client.id;
						r.currency = r.company.base_currency || companies.mainCompany.base_currency;
						console.log('THE R',r);
						OrderCore.createTransferReservationByImport(req,r,client,companies,function(err,r){
							if(err) item[0] = err;
							return cb(false,item);
						});
					});//getTransferPrice
				});//create client
			});
        });
	},function(err,rows){
		//results
		console.log('GLOBAL ERR:',err);
		console.log('end');
		columns.unshift('_err');
		book.sheets[0].values.unshift(columns);
		return callback(err,book);
	});
};
/*  Obtiene los precios y los agrega a la reservación (r), luego llama a la función adecuada para generar la reserva
	req 		: request var of the system
	r 			: reservation object
	c 			: client object
	companies 	: company and maincompany(if necesary)
	cb 			: callback 
*/
module.exports.createTransferReservationByImport = function(req,r,c,companies,cb){
	Location.findOne(r.hotel.location).populate('airportslist').exec(function(err,hotelLocation){
		if( err || !hotelLocation.airportslist || hotelLocation.airportslist.length == 0 ){
			//r._err = "No se encontró Aeropuerto relacionado a esta ubicación";
			return cb("No se encontró Aeropuerto relacionado a esta ubicación",r);
		}
		var airport = hotelLocation.airportslist[0];
		if( err || !airport ){
			//r._err = "No se encontró Aeropuerto relacionado a esta ubicación";
			return cb("No se encontró Aeropuerto relacionado a esta ubicación",r);
		}
		OrderCore.getTransferPrice(airport.zone,r.hotel.zone,r.transfer.id,companies.company.id,companies.mainCompany,function(err,prices){
			console.log('PRICES ERR:',err);
			if(err||!prices||!prices.price){
				//r._err = "No se encontró precio disponible para este servicio";
				return cb("No se encontró precio disponible para este servicio",r);
			} //return cb({message:'no price found'},false);//price contiene price y mainPrice para agregar a la reser
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
			console.log('Create reservation by import')
			OrderCore.createReservationByImport(r,req,cb);
		});//Exchange_rates
	});
};
module.exports.createReservationByImport = function(r,req,cb){
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
	    		if(err){
					//r._err = "Error al crear la reserva";
					return cb("Error al crear la reserva",r);
				} //return cb(err,false);
	    		order.reservations.add(reservation.id);
	    		order.state = reservation.state;
	    		result.payment_method = 'creditcard';
	    		console.log('ORDER SAVED',order);
	    		order.save(cb);
	  		});//Reservation create
		});//order findone
	});//create order
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
  return result;
};
module.exports.formatReservationsTransferPrices = function(c,rs,callback){
	async.mapSeries( rs, function(r,cb){
		if( r.reservation_type != 'transfer' || r.transferprice) return cb(false,r);
		if( !r.hotel || !r.airport || !r.transfer ) return cb(false,r);
		TransferPrice.findOne({ 
			company : c.id, active : true, transfer : r.transfer.id
	      	,"$or" : [ 
	        	{ "$and" : [{'zone1' : r.hotel.zone, 'zone2' : r.airport.zone}] } , 
	        	{ "$and" : [{'zone1' : r.airport.zone, 'zone2' : r.hotel.zone}] } 
	      	] 
    	}).exec(function(err,tp){
    		if(err||!tp) return cb(false,r);
    		r.transferprice = tp.id;
    		r.save(function(err,rr){
    			console.log('SAVED');
    			r.transferprice = tp;
    		});
    	});
	},function(err,reservations){
		return callback(reservations);
	});
}