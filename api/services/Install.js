module.exports.preload = function(){

	//Ejecuta la funcion loadObjects en serie;
	async.series([
		function(cb){Install.loadObjects({model:Currency,objects:sails.config.currencies})},
		function(cb){Install.loadObjects({model:FoodScheme,objects:sails.config.foodschemes})},
		function(cb){Install.loadObjects({model:HotelRoomView,objects:sails.config.hotelroomviews})},
	],function(e,results){
		//Esta funcion se llama cuando se termina todo
		if(e) throw(e);
		console.log(results);
	});
};


module.exports.loadObjects = function(params,callback){
	//Ejecuta findOrCreate asincronamente y manda a llamar el callback cuando termina de procesar todos los objetos
	async.map(params.objects, (function(object,callback) {
		params.model.findOrCreate(object, object).exec(function(err,params){
			console.log(params);
		});
	}),callback);
}