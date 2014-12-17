module.exports.loadCurrencies = function(){
	Currency.create(sails.config.currencies).exec(function(err,Currency){
		if(err)
		{
			console.log(err);
			throw err;
		}
	});
}