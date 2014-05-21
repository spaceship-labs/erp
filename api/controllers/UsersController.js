/**
 * UsersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var fs = require('fs')
, bcrypt = require('bcrypt')
, moment = require('moment');

module.exports = {
	index: function(req,res){
		var find = {}
		, select_company = req.session.select_company || req.user.select_company;
		find['companies.'+select_company] ={$exists:1};
		User.find(find).exec(function(err,users){
			var alphabets_company = []
			, index;
			for(var i=0;i<users.length;i++){
				index = users[i].name[0].toUpperCase();
				alphabets_company.push(index);
			}
			
			
			Apps.find().exec(function(err,apps){
				Common.view(res.view,{
					 apps:apps
					, alphabets_company:alphabets_company
				},req);
			});
		});
	}

	, all: function(req,res){
		var find = {}
		, select_company = req.session.select_company || req.user.select_company;
		find['companies.'+select_company] ={$exists:1};
		User.find(find,{password:0}).exec(function(err,users){
			if(!err){
				for(var i=0;i<users.length;i++){
					users[i].createdAtString = timeFormat(users[i].createdAt);
					users[i].apps = users[i].companies[select_company].toString();
				}
				res.json(users);
			}
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
		form.app_select = form.app_select || [];//null apps;
		if(!form.app_select.pop){
			form.app_select = [form.app_select];
		}

		var select_company = req.session.select_company || req.user.select_company;
		form.default_company = select_company;
		
		form.app_select.push('home');
		form.app_select.push('main');
		var tmp = {}
		tmp[select_company] = form.app_select.slice();
		form.companies = tmp;
		delete form.app_select;
		form.password = bcrypt.hashSync(form.password,bcrypt.genSaltSync(10));
		User.create(form).exec(function(err,user){
			if(err) return res.json(response);
			fs.readFile(req.files.icon_input && req.files.icon_input.path,function(err,data){
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

function timeFormat(date){
	date = moment(date);
	var now = moment();
	if(now.diff(date,'days',true)<1){
		return date.lang('es').fromNow();
	}
	return date.lang('es').format('LLLL');
}
