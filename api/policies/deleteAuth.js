/**
 * authorize
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	if(req.isAuthenticated()){
		var select_company = req.session.select_company || req.user.select_company;
        if (!select_company || !req.user) return res.forbidden();

        if (req.options.controller != 'home' && req.options.controller != 'template' && !authorize.getPermissionByControllerAction(select_company,req.user,req.options.controller,req.options.action)) {
            return res.forbidden();
        }

        return next();
	}else{
		Company.find({},function(e,c){
			if(c.length) res.redirect('/entrar');
			else{
				res.redirect('/install');
			}
		});	
	}

     
};

