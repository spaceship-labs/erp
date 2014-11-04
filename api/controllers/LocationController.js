/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Location.find().sort('name').exec(function(e,locations){
			Common.view(res.view,{
				locations:locations,
				page:{
					name:'Locations'
					,icon:'fa fa-flag'		
					,controller : 'location.js'
						
				},
				breadcrumb : [
					{label : 'Ciudades'}
				]
			},req);
		});
	},
	edit : function(req,res){
		Location.findOne(req.params.id).exec(function(e,location){
			if(e) return res.redirect("/location/");
			Common.view(res.view,{
				location_o:location,
				page:{
					name:location.name,
					icon:'fa fa-flag',
					controller : 'location.js'
				},
				breadcrumb : [
					{label : 'Ciudades', url: '/location/'},
					{label : location.name},
				]
			},req);	
		});
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	Location.update({id:id},form,function(e,location_o){
    		if(e) throw(e);
    		console.log(location_o);
    		Location.findOne(location_o[0].id).exec(function(e,location_o){
    			if(e) throw(e);
    			console.log(location_o);
    			res.json(location_o);
    		});
    	});
    }
};

