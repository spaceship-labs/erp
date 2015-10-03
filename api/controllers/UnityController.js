/**
 * UnityController
 *
 * @description :: Server-side logic for managing unities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req,res){
		Unity.find({}).sort('name').exec(function(e,unities){ UnityType.find().sort('name').exec(function(e,unityTypes){
			Common.view(res.view,{
				unities : unities
				,unityTypes : unityTypes
				,page:{
					name : 'Unidades',
					icon : 'fa fa-taxi',
					controller : 'unity.js'
				},
				breadcrumb : [
					{label : 'Unidades'}
				]
			},req);	
		}); });
	},
	create : function(req,res){
		var form = req.params.all();
		Unity.create(form).exec(function(err,unity){
			if(err) return res.json({text:err});
			Unity.find({}).sort('name').exec(function(e,unities){
				if(e) return res.json({text:e});
				var result = { unities : unities , theunity : unity }
				res.json(result);
			});
		});
	},
	edit : function(req,res){
		Unity.findOne(req.params.id).exec(function(e,unity){ UnityType.find().exec(function(tc_err,unitytypes){
			if(e) return res.redirect("/unity/");
			Common.view(res.view,{
				unity:unity,
				unitytypes:unitytypes,
				page:{
					saveButton : true,
					name : unity.name,
					icon:'fa fa-taxi',
					controller : 'unity.js'
				},
				breadcrumb : [
					{label : 'Unidades', url: '/unity/'},
					{label : unity.name},
				]
			},req);
		}); }); //unity and types
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	Unity.update({id:id},form,function(e,unity){
    		if(e) throw(e);
    		Unity.findOne(unity[0].id).exec(function(e,unity){
    			if(e) throw(e);
    			res.json(unity);
    		});
    	});
    },
	destroy : function(req,res){
		Unity.destroy({id:req.params.id}).exec(function(e,r){
			if(e) throw(e);
			res.json(r);
		})
	},
};

