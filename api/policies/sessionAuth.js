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
		var company = req.user.companies[req.user.select_company];
		if(company && company.indexOf(req.options.controller)!=-1){
			return next();
		}
		return res.forbidden()
	}
	res.redirect('/home/login');
};
