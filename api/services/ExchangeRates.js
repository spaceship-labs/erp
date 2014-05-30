var oxr = require('open-exchange-rates');

module.exports.getCurrencies = function(cb){
	if(sails.config.exchangeRates){
		oxr.set(sails.config.exchangeRates);
		oxr.latest(function(err){
			if(err)	return cb && cb(err);
			
			Currency.find().exec(function(err,cu){
				if(err)	return cb && cb(err);

				var currencies = {};
				for(var i=0;i<cu.length;i++){
					currencies[cu[i].currency_code] = oxr.rates[cu[i].currency_code];	
				}
				Exchange_rates.create({
					rates:currencies
				}).exec(function(err,ex){
					return cb && cb(err,ex);
				});
			});
		});
	}
}
