/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index:function(req,res){
		User.find({default_company:req.user.default_company}).exec(function(err,user){
			var alphabets_company = [];
			for(var i=0;i<user.length;i++){
				alphabets_company.push(user[i].name[0].toUpperCase());
			}
			res.view({alphabets_company:alphabets_company});
		});
	}
};

