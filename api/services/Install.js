module.exports.preload = function(){

	//Ejecuta la funcion loadObjects en serie;
	async.series([
		function(cb){Install.loadObjects({model:Currency,objects:sails.config.currencies},cb)},
		function(cb){Install.loadObjects({model:FoodScheme,objects:sails.config.foodschemes},cb)},
		function(cb){Install.loadObjects({model:HotelRoomView,objects:sails.config.hotelroomviews},cb)},
	],function(e,results){
		//Esta funcion se llama cuando se termina todo
		if(e) throw(e);
		console.log(results);
	});
	
};

module.exports.preloadAlt = function(){
	//Otra manera de hacer lo mismo de preload
	var params = [
		{model:Currency,objects:sails.config.currencies},
		{model:FoodScheme,objects:sails.config.foodschemes},
		{model:HotelRoomView,objects:sails.config.hotelroomviews},
	];

	async.mapSeries(params,Install.loadObjects,function(e,results){
		//Esta funcion se llama cuando se termina todo
		if(e) throw(e);
		console.log(results);
	});
}

module.exports.loadObjects = function(params,callback){
	//Ejecuta findOrCreate asincronamente y manda a llamar el callback cuando termina de procesar todos los objetos
	async.map(params.objects, (function(object,callback) {
		params.model.findOrCreate(object, object).exec(function(err,params){
			console.log(params);
		});
	}),callback);
}