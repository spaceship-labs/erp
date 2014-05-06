/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req,res){
		//var filter = req.params.id;
		User.find({default_company:req.user.default_company}).exec(function(err,user){
			var alphabets_company = []
			, index;
			for(var i=0;i<user.length;i++){
				index = user[i].name[0].toUpperCase();
				alphabets_company.push(index);
			}

			Common.view(res.view,{
				alphabets_company:alphabets_company
			});
		});
	}

	, all: function(req,res){
		User.find({default_company:req.user.default_company},{password:0}).exec(function(err,user){
			if(!err)
				res.json(user);
		})
	}

	, edit: function(req,res){
		Common.view(res.view);
	}
};

