var oxr = require('open-exchange-rates');

module.exports.getCurrencies = function(cb){
	sails.config.exchangeRates = sails.config.exchangeRates || {
									app_id: process.env.EXCHANGE_RATES
								};
	if(sails.config.exchangeRates && sails.config.exchangeRates.app_id){
		oxr.set(sails.config.exchangeRates);
		oxr.latest(function(err){
			if(err)	return cb && cb(err);
			
			Currency.find().exec(function(err,cu){
				if(err || !cu.length)	return cb && cb(err);

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
	}else{
		sails.log.warn("No app_id for exchange rates");
	}
}

module.exports.getOneData = function(cb){
	Exchange_rates.count(function(err, n){
		if(n > 0)
			return cb && cb(err, n);

		module.exports.getCurrencies();
	});
};
