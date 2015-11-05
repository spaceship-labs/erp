module.exports.getCancelationMotives = function(){
	var result = [
		'Mal tiempo'
		,'Mal servicio (proveedor)'
		,'No es lo que me vendieron (vendedor)'
		,'Otros'
	];
	return result;
}
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
    Order.create(params).exec(callback);
};
module.exports.createTransferReservation = function(params, defaultUserID, defaultCompany, callback){
	Order.findOne(params.order).exec(function(e,theorder){
		if(e) callback(e,false);
		params.hotel = params.hotel.id || params.hotel;
	    params.state = params.state.handle || params.state;
	    params.payment_method = params.payment_method ? params.payment_method.handle||params.payment_method : 'creditcard';
	    params.airport = params.airport.id || params.airport;
	    params.client = params.client.id||params.client;
	    params.user = defaultUserID;
	    delete params.id;
	    theorder.company = theorder.company || defaultCompany;
	    OrderCore.getCompanies(theorder.company,function(err,companies){
	    	if(err) callback(err,false);
	    	params.folio = theorder.folio;
	    	params.company = companies.company;
      		params.currency = params.currency?params.currency.id:params.company.base_currency;
      		OrderCore.getTransferPrice(params.transferprice.zone1,params.transferprice.zone2,params.transfer,companies.company.id,companies.mainCompany,function(err,prices){
      			if(err) callback(err,false);
      			Exchange_rates.find().limit(1).sort({createdAt:-1}).exec(function(err,theExhangeRates){
      				if(err) cb(err,item);
					theExhangeRates = theExhangeRates[0];
	      			params.service_type = prices.price.transfer.service_type || 'C' ;
	      			params.quantity = Math.ceil( params.pax / prices.price.transfer.max_pax );
	          		params.fee = prices.price[params.type] * params.quantity;
	          		if( params.currency != companies.company.base_currency )
	            		params.fee *= companies.company.exchange_rates[params.currency].sales;
	            	//se guardan los precios que se están cobrando
					params.fee_adults = prices.price.one_way;
					params.fee_adults_rt = prices.price.round_trip;
					params.fee_kids = prices.price.one_way_child;
					params.fee_kids_rt = prices.price.round_trip_child;
					params.exchange_rate_sale = companies.company.exchange_rates[params.currency].sales;
		            params.exchange_rate_book = companies.company.exchange_rates[params.currency].book;
					//en caso de que sea una reserva de agencia, guardar precios de la empresa principal
					if( companies.mainCompany && prices.mainPrice ){
						params.main_fee_adults 		= prices.mainPrice.one_way;
						params.main_fee_adults_rt 	= prices.mainPrice.round_trip;
						params.main_fee_kids 		= prices.mainPrice.one_way_child;
						params.main_fee_kids_rt 	= prices.mainPrice.round_trip_child;
					}
					params.globalRates = theExhangeRates.rates;
					Reservation.create(params).exec(function(err,reservation){
	            		if(err) callback(err,false);
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
	Order.findOne( params.order ).populate('company').exec(function(err,theorder){
		if(err) callback(err,false);
		async.mapSeries( params.items, function(item,cb) {
			item.order = theorder.id;
	        item.company = theorder.company.id;
	        item.user = userID;
	        item.payment_method = item.payment_method?item.payment_method.handle:(params.generalFields.payment_method?params.generalFields.payment_method.handle:'creditcard');
	        item.currency = params.currency?params.currency.id:theorder.company.base_currency;
	        item.autorization_code = item.autorization_code || params.generalFields.autorization_code || '';
	        item.state = item.state?item.state.handle:(params.generalFields.state?params.generalFields.state.handle:'pending');
	        delete item.id;
			OrderCore.getTourAndPrices(item.reservation_type,item[item.reservation_type].id,theorder.company,function(err,products){
				Exchange_rates.find().limit(1).sort({createdAt:-1}).exec(function(err,theExhangeRates){
					if(err) cb(err,item);
					theExhangeRates = theExhangeRates[0];
					if( item.reservation_type ){
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
	                item[item.reservation_type] = products.item.id;
	                item.folio = theorder.folio;
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
}
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
}
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
}
module.exports.getAvailableTransfers = function(zone1,zone2,company,callback){
	if(company.adminCompany){
	    TransferPrice.find({ 
	      company : company.id
	      ,active : true
	      ,"$or":[ 
	        { "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
	        { "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
	      ] 
	    }).populate('transfer').exec(callback);
	}else{
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
	}
};