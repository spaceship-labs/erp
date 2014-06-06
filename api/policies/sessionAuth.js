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
	if(req.isSocket) return next();

	if(req.isAuthenticated()){
		var select_company = req.session.select_company || req.user.select_company
		, company = req.user.companies[select_company];
		if(company && (company.indexOf(req.options.controller)!=-1) || req.options.controller == 'home' || req.options.controller == 'product') {
			return next();
		}
		return res.forbidden()
	}
	res.redirect('/home/login');
};
