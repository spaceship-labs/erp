/**
 * FoodSchemeController
 *
 * @description :: Server-side logic for managing foodschemes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		FoodScheme.find().sort('name DESC').exec(function(e,schemes){
			if(e) throw(e);
			Common.view(res.view,{
				schemes : schemes,
				page:{
					name: req.__('sc_foodscheme')
					,description: req.__('sc_foodscheme_desc')
					,icon:'fa fa-cutlery'
					,controller : 'hotelroomview.js'
				},
				breadcrumb : [
					{label : req.__('sc_foodscheme') }
				]
			},req);
		});
	},
  edit : function(req,res){
    FoodScheme.findOne(req.params.id).exec(function(e,scheme){
      if(e) throw(e);
      Common.view(res.view,{
        scheme : scheme,
        page:{
          name: req.__('sc_foodscheme')+': ' + scheme.name
          ,description: req.__('sc_foodscheme_desc')
          ,icon:'fa fa-cutlery'
          ,controller : 'hotelroomview.js'
        },
        breadcrumb : [
          {label : req.__('sc_foodscheme'),url : '/foodscheme/'},
          {label : scheme.name}
        ]
      },req);
    })
  },
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	FoodScheme.update({id:id},form,function(e,scheme){
    		if(e) throw(e);
    		FoodScheme.findOne(scheme[0].id).exec(function(e,scheme){
    			if(e) throw(e);
    			res.json(scheme);
    		});
    	});
	}
};

