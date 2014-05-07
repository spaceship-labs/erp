/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var fs = require('fs')
, bcrypt = require('bcrypt');

module.exports = {
	index: function(req,res){
		User.find({default_company:req.user.default_company}).exec(function(err,user){
			var alphabets_company = []
			, index;
			for(var i=0;i<user.length;i++){
				index = user[i].name[0].toUpperCase();
				alphabets_company.push(index);
			}

			Common.view(res.view,{
				page:{
					icon:'iconfa-briefcase'
					,name:'Usuarios'
				}
				, alphabets_company:alphabets_company
			});
		});
	}

	, all: function(req,res){
		User.find({default_company:req.user.default_company},{password:0}).exec(function(err,user){
			if(!err)
				res.json(user);
		})
	}

	, create: function(req,res){	
		var response = {
			status:false
			, msg:'ocurrio un error'
		}	
		, form = req.params.all() || {};
		form.id || delete form.id;
		form.active = 1;
		form.password = bcrypt.hashSync(form.password,bcrypt.genSaltSync(10));
		User.create(form).exec(function(err,user){
			if(err) return res.json(response);
			fs.readFile(req.files.icon_input.path,function(err,data){
				if(err) return res.json(response);
				var ext = req.files.icon_input.name.split('.')
				, id = user.id;
				if(ext.length){
					ext = ext[ext.length-1];
					id += '.'+ext;
				}

				fs.writeFile(__dirname+'/../../assets/uploads/'+id,data,function(err,data){
					if(err) return res.json(response);
					User.update({id:user.id},{icon:id},function(err){
						if(err) return res.json(response);
						res.json({
							status:true
							, msg:'El usuario se creo exitosamente'
						});
					});
				});	
			});
		});
		
	}

	, edit: function(req,res){
		Common.view(res.view);
	}
};
