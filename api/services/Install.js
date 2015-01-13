module.exports.loadCurrencies = function(){
	//console.log('instalando curriencies');
	_.forEach(sails.config.currencies, function(Currency2) { 
	//console.log(Currency2);
		Currency.create(Currency2).exec(function(err,Currency3){
			if(err){
				console.log(err);
				throw err;
			}
		});

	});

}

module.exports.loadFoodSchemes = function(){
	//console.log('instalando foodschemes');
	_.forEach(sails.config.foodschemes, function(foodscheme2) { 
	//console.log(foodscheme2);
		FoodScheme.create(foodscheme2).exec(function(err,foodscheme3){
			if(err){
				console.log(err);
				throw err;
			}
		});

	});

}

module.exports.loadHotelRoomView = function(){
	console.log('instalando HotelRoomView');
	_.forEach(sails.config.hotelroomviews, function(HotelRoomView2) { 
	console.log(HotelRoomView2);
		HotelRoomView.create(HotelRoomView2).exec(function(err,HotelRoomView3){
			if(err){
				console.log(err);
				throw err;
			}
		});

	});

}
