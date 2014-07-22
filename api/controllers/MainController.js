/**
 * MainController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	select_company: function(req,res){
		req.session.select_company = req.params.id;
		res.redirect(req.headers.referer || '/');
	}
};
