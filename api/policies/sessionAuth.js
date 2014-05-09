/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

	if(req.isAuthenticated()){
		var company = req.user.select_company
		for(var i=0;i<req.user.companies.length;i++){
			var c = req.user.companies[i];
			if(c && c[company]){
				if(c[company].indexOf(req.options.controller)!=-1){
					return next();
				}
			}
		}
		return res.forbidden()
	}
	res.redirect('/home/login');

};
