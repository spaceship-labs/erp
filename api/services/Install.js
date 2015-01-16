module.exports.preload = function(){
	Install.loadObjects({model:Currency,objects:sails.config.currencies});
	Install.loadObjects({model:FoodScheme,objects:sails.config.foodschemes});
	Install.loadObjects({model:HotelRoomView,objects:sails.config.hotelroomviews});
	/*Install.loadObjects(Currency,sails.config.currencies);
	Install.loadObjects(FoodScheme,sails.config.foodschemes);
	Install.loadObjects(HotelRoomView,sails.config.hotelroomviews);*/

};


module.exports.loadObjects = function(params,callback){
	async.map(params.objects, (function(object,callback) {
		params.model.findOrCreate(object, object).exec(function(err,params){
			console.log(params);
		});
	}), function(error, createdOrFoundObjects) {
		console.log(error, createdOrFoundObjects)
	})

	/*params.model,params.objects  model.findOrCreate({model:Currency,objects:sails.config.currencies}, object).exec(callback);*/
	/*_.forEach(objects, function(object) {
	console.log(model) 
		model.findOrCreate(object,object).exec(function(err,obj){
			//console.log(obj)
			if(err){
				console.log(err);
				throw err;
			}
		});
});*/
}