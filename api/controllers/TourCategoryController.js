/**
 * TourCategoryController
 *
 * @description :: Server-side logic for managing Tourcategories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    TourCategory.find().sort('name').exec(function(e,tourcategories){
		Common.view(res.view,{
			tourcategories:tourcategories,
			page:{
				name:'Tour Categories'
				,icon:'fa fa-folder'
				,controller : 'tourcategories.js'
			},
			breadcrumb : [
				{label : 'tourcategories'}
			]
		},req);
	});
  }
	,edit : function(req,res){
		TourCategory.findOne(req.params.id).exec(function(e,tourcategory){
			Common.view(res.view,{
				tourcategory:tourcategory,
				page:{
					name:'Tour Categories'
					,saveButton : true
					,icon:'fa fa-folder'
					,controller : 'tourcategories.js'
				},
				breadcrumb : [
					{label : 'Categorías de tours' , url : '/tourcategory/'}
					,{label : 'Categorías de tours : ' + tourcategory.name}
				]
			},req);
		});
	}
	,find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		//console.log(params);
		if( typeof params.id == 'undefined' )
			delete params.id;
		else
			params.id = JSON.parse(params.id);
		delete params.skip;
		if(params.name) params.name = new RegExp(params.name,"i");

		TourCategory.find(params).skip(skip).exec(function(err,tourcategories){
			if(err) res.json('err');
			//console.log(tourcategories);
			TourCategory.count(params).exec(function(e,count){
				if(e) res.json('err');
				res.json({ results : tourcategories , count : count });
			});
		});
	}
  	,updateIcon: function(req,res){
    	form = req.params.all();
		TourCategory.updateAvatar(req,{
			dir : 'tourcateories',
			profile: 'avatar',
			id : form.id,
		},function(e,category){
			if(e) console.log(e);
			res.json(category);
		});
	}
};

