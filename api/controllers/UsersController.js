/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index:function(req,res){
		var filter = req.params.id;
		User.find({default_company:req.user.default_company}).exec(function(err,user){
			var alphabets_company = []
			, users = []
			, index;
			for(var i=0;i<user.length;i++){
				index = user[i].name[0].toUpperCase();
				alphabets_company.push(index);
				if(!filter){
					filter = alphabets_company[0];	
				}
				if(index == filter){
					users.push(user[i]);
				}
			}

			Common.view(res.view,{
				alphabets_company:alphabets_company
				,users:users
			});
		});
	}

	, edit:function(req,res){
		Common.view(res.view);
	}
};

