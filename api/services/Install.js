module.exports.preload = function(){
	Install.loadObjects(Currency,sails.config.currencies);

}


module.exports.loadObjects = function(model,objects){
	_.forEach(objects, function(object) { 
		model.create(object).exec(function(err,obj){
			if(err){
				console.log(err);
				throw err;
			}
		});
	});
}