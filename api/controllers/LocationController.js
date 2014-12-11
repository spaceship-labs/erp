/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Location.find().sort('name').populate('zones').exec(function(e,locations){
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
		Location.findOne(req.params.id).populate('zones').exec(function(e,location){
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
    		Location.findOne(location_o[0].id).exec(function(e,location_o){
    			if(e) throw(e);
    			res.json(location_o);
    		});
    	});
    },
    addZone : function(req,res){
		var form = req.params.all();
		var location_o = form.location;
		Zone.create(form).exec(function(e,r){
			if(e) throw(e);
			Location.findOne(location_o).populate('zones').exec(function(e,location_o){
				if(e) throw(e);
				location_o = location_o;
				res.json(location_o)
			});
		});
	},
	updateIcon: function(req,res){
    	form = req.params.all();
		Location.updateAvatar(req,{
			dir : 'locations_o',
			profile: 'avatar',
			id : form.id,
		},function(e,location){
			res.json(location);
		});
	},
	addFiles : function(req,res){
		form = req.params.all();
    	Location.findOne({id:form.id}).exec(function(e,location){
    		if(e) throw(e);
    		location.addFiles(req,{
    			dir : 'locations_o/gallery',
    			profile: 'gallery'
    		},function(e,location){
    			if(e) throw(e);
    			res.json(location);
    		});
    	});
	},
	removeFiles : function(req,res){
		form = req.params.all();
		Location.findOne({id:form.id}).exec(function(e,location){
			location.removeFiles(req,{
				dir : 'locations_o/gallery',
				profile : 'gallery',
				files : form.removeFiles,
			},function(e,location){
				if(e) throw(e);
				res.json(location);
			})
		});
	},
};

