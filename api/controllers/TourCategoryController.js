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
  	
  }
};

