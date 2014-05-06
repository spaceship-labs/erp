/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');
module.exports = {
	login: function(req,res){
		res.view({
			layout:null
		});
	}

	, logout: function(req,res){
		req.logout();
		res.redirect('/home/login');	
	}

	, auth: passport.authenticate('local',{
						    successRedirect: '/home/'
		                                   ,failureRedirect: '/home/login'
						   ,failureFlash: true
					   })

	, index: function(req,res){
		Common.view(res.view,{
			page:{
				icon:'iconfa-home'
				,name:'Tablero'
			}
		});
	}
};
