module.exports.createTransferPrices = function(locations , transfers , company , callback){
	async.each(locations, function(l, each_cb){
		//Ejecuta create asincronamente y manda a llamar el callback cuando termina de procesar todos los objetos
		if( l.zones ){
			//se crean para las zonas del location
			Transferprices.mapPrices(l.zones,l.zones,transfers,company,l.id,false,function(){
				if( l.locations ){
					console.log('have locations');
					//si tiene locations relacionados se recorren para obtener sus zonas
					async.mapSeries( l.locations , (function(lr,cb_lr) {
						Location.findOne(lr.id).populate('zones').exec(function(e,location_o){
							//se crean los precios para: las zonas: del location principal con el location relacionado
							console.log('empezará a crearlos');
							console.log(location_o);
							Transferprices.mapPrices(l.zones,location_o.zones,transfers,company,l.id,location_o.id,false);
						});
					}),callback);
				}
			});
		}
	});
}
module.exports.mapPrices = function(z1,z2,t,c,l,l2,cbF){
	async.mapSeries( Transferprices.formatAllPrices(z1,z2,t,c,l,l2),(function(object,cb){
		//console.log('object');
		//console.log(object);
		//TransferPrice.findOrCreate(object).exec(cb);
		TransferPrice.findOrCreate(
			{
				company : object.company , transfer : object.transfer , 
				"$or":[ { 
					"$and" : [{'zone1' : object.zone1, 'zone2' : object.zone2 , 'location' : object.location, 'location2' : object.location2}] , 
					"$and" : [{'zone1' : object.zone1, 'zone2' : object.zone2 , 'location' : object.location2, 'location2' : object.location}] ,
					"$and" : [{'zone1' : object.zone2, 'zone2' : object.zone1 , 'location' : object.location, 'location2' : object.location2}] ,
					"$and" : [{'zone1' : object.zone2, 'zone2' : object.zone1 , 'location' : object.location2, 'location2' : object.location}] 
				}]
			},
			object, //objeto a crear
			cb //callback
		);
	}),cbF);
};
module.exports.pricesToArray = function(prices){
	var result = [];
	for ( var x in prices ) {
		var price = prices[x];
		result[ price.zona1 ][ price.zona2 ] = price;
	};
	return result;
}
module.exports.formatAllPrices = function( zones1 , zones2 , transfers , company , location , location2 ){
	var result = [];
	for(var c=0;c<company.length;c++){
		for(var t=0;t<transfers.length;t++){
			var aux = [];
			for(var z1=0;z1<zones1.length;z1++){
				for(var z2=0;z2<zones2.length;z2++){
					if( typeof aux[zones1[z1].id + zones2[z2].id ] == 'undefined' ){
						var form = { 
							'one_way' : 0 , 'round_trip' : 0 , active : false ,
							'company' : company[c].id , 'transfer' : transfers[t].id ,
							'zone1' : zones1[z1].id , 'zone2' : zones2[z2].id ,
							'location' : location , 'location2' : location2
						}
						aux[zones1[z1].id + zones2[z2].id] = true;
						aux[zones2[z2].id + zones1[z1].id] = true;
						result.push( form );
					}
				}
			}
		}
	}
	return result;
}
module.exports.afterCreateZone = function(zone , locations , transfers , company , callback){
	//console.log('locations');console.log(locations);
	async.each(locations, function(l, ckt){
		//console.log('l');console.log(l);
		if( l.zones ){
			Transferprices.mapPrices(zone,l.zones,transfers,company,l.id,false,function(){
				//checar las relaciones
				if( l.locations ){
					//console.log('have locations');
					//si tiene locations relacionados se recorren para obtener sus zonas
					async.mapSeries( l.locations , (function(lr,cb_lr) {
						Location.findOne(lr.id).populate('zones').exec(function(e,location_o){
							//se crean los precios para: las zonas: del location principal con el location relacionado
							//console.log('empezará a crearlos');console.log(location_o);
							Transferprices.mapPrices(zone,location_o.zones,transfers,company,l.id,location_o.id,false);
						});
					}),callback);
				}
			});
			/*async.map( Transferprices.formatAllPrices(zone,l.zones,transfers,company,l.id,false) , (function(object,cb) {
				TransferPrice.create(object).exec(cb);
			}),callback);*/
		}
	});
}
/*
	Haré dos, una en la que sólo tenga los ids y otra en la que tenga todo el objeto
	calculatePrice recibe: 
		- Hotel (object) para obtener su zona
		- Aeropuerto (object) para obtener su zona
		- Transfer (object)
		- Tipo transfer (oneway roundtrup)
		- Pax, para calcular del monto final
		- Comapany (object) para filtrar por coompany
*/
module.exports.calculatePrice = function(hotel,airport,transfer,t_type,pax,company,cb){
	if( hotel && hotel.zone && airport && airport.zone && transfer && pax ){
		TransferPrice.findOne({ 
	        company : company, transfer : transfer.id, active : true, 
	        "$or":[ 
	          { "$and" : [{ 'zone1' : hotel.zone, 'zone2' : airport.zone }] } , 
	          { "$and" : [{ 'zone1' : airport.zone, 'zone2' : hotel.zone }] } 
	        ] 
      	}).exec(function(err,price){
      		if(err) cb(0);
      		var result = price[t_type] * priceMath.ceil( pax / transfer.max_pax );
      		cb(result);
      	});
	}else{
		cb(0);
	}
}
/*
	Función que devuelve los precios de una compañia 
*/
module.exports.getPricesbyCompany = function(company,service,type,cb){
	if( !company ) return cb({message:'no company found'},false);
	var fields = {
        company : company.id
        ,transfer : service.id
    };
    if( type == 'agency' )
        fields.or = [ { type : 'agency' }, { type : { '!' : 'provider' } } ];
    else
        fields.type = 'provider';
    TransferPrice.find().where(fields).populateAll().exec(cb);
};
module.exports.ifPriceExist = function(price,cb){
	if( price.zone1 && price.zone2 && price.company && price.transfer ){
		var fields = {
			'$or' : [ 
				{ 'zone1' : price.zone1 , 'zone2' : price.zone2 } 
				,{ 'zone2' : price.zone1 , 'zone1' : price.zone2 } 
			]
			,company : price.company.id
			,transfer : price.transfer.id
		};
		if( price.type && price.type == 'provider' )
			fields.type = 'provider';
		console.log('new price fields',fields);
		TransferPrice.find(fields).populateAll().exec(function(err,price){
			console.log('new price',price);
			if( err ) return cb(err,false);
			else return cb(false,price.length);
		});
	}else{
		return cb({message:'no complete params'},false);
	}
};
module.exports.newPrice = function(price,cb){
	//validate price params
	delete price.id;
	Transferprices.ifPriceExist(price,function(err,result){
		if(err) return cb(err,false);
		if( !result ){
			TransferPrice.create(price).exec(function(err,p){
				if(err) return cb(err,false)
				TransferPrice.findOne(p.id).populateAll().exec(function(err,p){
					if(err) return cb(err,false)
					console.log('NEW PRICE',p);
					return cb(false,p);
				});
			});
		}else{
			return cb(false,false);
		}
	});
}