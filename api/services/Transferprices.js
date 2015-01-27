module.exports.createTransferPrices = function(locations , transfers , company , callback){
	async.each(locations, function(l, each_cb){
		//Ejecuta create asincronamente y manda a llamar el callback cuando termina de procesar todos los objetos
		if( l.zones ){
			async.map( Transferprices.formatAllPrices(l.zones,l.zones,transfers,company,l.id) , (function(object,cb) {
				console.log('object');console.log(object);
				TransferPrice.create(object).exec(cb);
			}),callback);
		}
	});
}
module.exports.pricesToArray = function(prices){
	var result = [];
	for ( var x in prices ) {
		var price = prices[x];
		result[ price.zona1 ][ price.zona2 ] = price;
	};
	return result;
}
module.exports.formatAllPrices = function( zones1 , zones2 , transfers , company , location ){
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
							'location' : location
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
	console.log('locations');
	console.log(locations);
	async.each(locations, function(l, ckt){
		console.log('l');
		console.log(l);
		if( l.zones ){
			async.map( Transferprices.formatAllPrices(zone,l.zones,transfers,company,l.id) , (function(object,cb) {
				console.log('object');console.log(object);
				TransferPrice.create(object).exec(cb);
			}),callback);
		}
	});
}