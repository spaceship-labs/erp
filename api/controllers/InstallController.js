/**
 * InstallController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		App.find().exec(function(err,apps){
			if(err) throw err;
			Currency.find().exec(function(err,currencies){
				res.view({
					layout:null,
					apps:apps || [],
					currencies:currencies || [],
				});				
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
		var apps = Array.isArray(form.apps) ? form.apps : [form.apps];
		var currencies = Array.isArray(form.currencies) ? form.currencies : [form.currencies];
		var user = {
			name : form.user_name,
			last_name : form.last_name,
			email : form.email,
			active : 1,
		}
		var password = form.password;
		delete form.apps;
		delete form.currencies;
		delete form.user_name;
		delete form.last_name;
		delete form.email;
		delete form.password;
		Company.create(form).exec(function(err,company){
			if(err) return res.json(response);
			apps.forEach(function(app){
				company.apps.add(app);
			});
			currencies.forEach(function(currency){
				company.currencies.add(currency);
			});
			company.save();
			user.default_company = company.id;
			User.create(user).exec(function(e,user){
				if(e) return res.json(response);
				apps.forEach(function(app){
					User_app.create({company:company.id,user:user.id,app:app,access_list:{}},function(e,ua){
						console.log(ua);

					});
				})
				//user.save();
				user.companies.add(company.id);
				user.setPassword(password);
				res.json(true);
			});	
			
		});
	}
};
