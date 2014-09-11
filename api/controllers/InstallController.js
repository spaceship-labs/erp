/**
 * InstallController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		Currency.find().exec(function(err,currencies){
			res.view({
				layout:null,
				apps: sails.config.apps,
				currencies:currencies || [],
			});				
		});
	},
	create: function(req,res){
		var form = req.params.all() || {}
		, response = {
			status:false
			, msg:'ocurrio un error'
		};
		delete form.id;
		form.active = true;
		var currencies = Array.isArray(form.currencies) ? form.currencies : [form.currencies];
		if(currencies.indexOf(form.base_currency)==-1)
			currencies.push(form.base_currency);
		var user = {
			name : form.user_name,
			last_name : form.last_name,
			email : form.email,
			active : true,
		}
		var password = form.password;
		//delete form.apps;
		delete form.currencies;
		delete form.user_name;
		delete form.last_name;
		delete form.email;
		delete form.password;
		Company.create(form).exec(function(err,company){
			if(err) return res.json(response);
			
			currencies.forEach(function(currency){
				company.currencies.add(currency);
			});
			company.save();

			user.default_company = company.id;
			user.active = true;
			User.create(user).exec(function(e,user){
				user.createAccessList(form.apps);
				if(e) return res.json(response);
				user.companies.add(company.id);
				user.setPassword(password);
				res.json(true);
			});	
			
		});
		ExchangeRates.getCurrencies();
	}
};
