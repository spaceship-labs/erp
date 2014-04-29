/**
 * HomeController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');
module.exports = {
	login: function(req,res){
		res.view();
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
		if(req.user && req.user.id){
			User.find({id:req.user.id},{user:1}).exec(function(err,user){
				res.view({user:user[0]});
			})
		}else
			res.redirect('/home/login');

	}
};
