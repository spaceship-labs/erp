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
	if (req.isSocket) return next();

	if (req.isAuthenticated()) {
		var select_company = req.session.select_company || req.user.select_company;
      if (!select_company || !req.user) return res.forbidden();

      if (req.options.controller != 'home' && req.options.controller != 'template' && !getPermissionByControllerAction(select_company,req.user,req.options.controller,req.options.action)) {
        return res.forbidden();
      }
      if (req.method == 'DELETE') {
        var params = req.params.all()
        //todo si tienes password checar y dar permiso si no no
      }
      return next();
	} else {
		Company.find({},function(e,c) {
		  if (c.length) res.redirect('/home/login');
			else {
				res.redirect('/setup');
			}
		});	
	}

  //TODO cambiar a funcion asincrona que reciba callback
  function getPermissionByControllerAction(company,user,controller,action) {
    var auxLastPermission = true;
    for (var i in sails.config.apps) { //OJO forEach y each maldita asincronia
      var app = sails.config.apps[i];
      for (var j in app.actions) {
        var aux_action = app.actions[j];
        if (aux_action.controller && aux_action.controller == controller) {
          if (aux_action.action) {
            if (aux_action.action == action) {
              return user.hasPermission(company,aux_action.handle);
            }
          } else {
            auxLastPermission = user.hasPermission(company,aux_action.handle);
          }
        }
      }
    }
    return auxLastPermission;
  }
};

