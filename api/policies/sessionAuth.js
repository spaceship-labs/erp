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
		, company = select_company;

        //console.log(req.user);

//		if(company && (company.indexOf(req.options.controller)!=-1) || req.options.controller == 'home' || req.options.controller == 'product') {
//            return res.forbidden();
//		}

        return next();
	}else{
		Company.find({},function(e,c){
			if(c.length) res.redirect('/home/login');
			else{
				res.redirect('/install')
			};
		});	
	}
	
};
