/**
 * SetupController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
	  Company.find({},function(e,c){
    	if(c.length > 0) return res.redirect('/entrar');

			Setup.preloadAlt(function(e,results){
				Currency.find().exec(function(err,currencies){
					res.view({
						layout: null,
						apps: sails.config.apps,
						currencies:currencies || [],
					});				
				});
			});
	  });
	},
	create: function(req,res){
		var form = req.params.all() || {}
		var response = {
			status: false,
			msg: 'Ocurrio un error'
		};
		delete form.id;
		form.active = true;
		form.adminCompany = true;
		var currencies = Array.isArray(form.currencies) ? form.currencies : [form.currencies];
		if(currencies.indexOf(form.base_currency)==-1)
			currencies.push(form.base_currency);
		var user = {
			name : form.uname,
			last_name : form.ulast_name,
			email : form.uemail,
			active : true,
		};
		var password = form.upassword;
		//delete form.apps;
		delete form.currencies;
		delete form.uname;
		delete form.ulast_name;
		delete form.uemail;
		delete form.upassword;
		Company.create(form).exec(function(err,company){
			if(err) return res.json(response);
			
			currencies.forEach(function(currency){
				company.currencies.add(currency);
			});
			company.save();

			user.default_company = company.id;
			user.active = true;
      user.isAdmin = true;
			User.create(user).exec(function(e,user){
				if(e) return res.json(response);
				user.companies.add(company.id);
				user.setPassword(password);
				res.json({status: true});
			});	
			
		});
		ExchangeRates.getCurrencies();
	}
};
