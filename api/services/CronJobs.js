var cron = require('cron').CronJob;
module.exports.init = function(){
	var cronJobs = [
		{
			fn: function(d){
				ExchangeRates.getCurrencies();
			}
			, time:'0 0 6 * * *'
			//s,m,h,d del mes,m,d de la semana
		}
	].forEach(function(v){
		new cron(v.time,v.fn, true, true);
	});
};
