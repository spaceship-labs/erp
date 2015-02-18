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
					name:'Esquemas de alimentación'
					,description: 'Administracion de esquemas para hoteles'
					,icon:'fa fa-cutlery'
					,controller : 'hotelroomview.js'
				},
				breadcrumb : [
					{label : 'Esquemas'}
				]
			},req);
		});
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

