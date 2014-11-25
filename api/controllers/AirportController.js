/**
 * AirportController
 *
 * @description :: Server-side logic for managing Airports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Airport.find().sort('name').populate('location').exec(function(e,airports){
			Location.find().sort('name').exec(function(e,locations){
				Common.view(res.view,{
					airports : airports,
					locations : locations,
					page:{
						name:'Aeropuertos'
						,icon:'fa fa-plane'		
						,controller : 'airport.js'
					},
					breadcrumb : [
						{label : 'Aeropuertos'}
					]
				},req);
			});
		});
	},
	edit : function(req,res){
		Airport.findOne(req.params.id).exec(function(e,airport){
			Location.find().sort('name').exec(function(e,locations){
				if(e) return res.redirect("/airport/");
				Common.view(res.view,{
					airport:airport,
					locations:locations,
					page:{
						name:airport.name,
						icon:'fa fa-plane',
						controller : 'airport.js'
					},
					breadcrumb : [
						{label : 'Aeropuertos', url: '/airport/'},
						{label : airport.name},
					]
				},req);	
			});
		});
	},
	update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	Airport.update({id:id},form,function(e,airport){
    		if(e) throw(e);
    		Airport.findOne(airport[0].id).exec(function(e,airport){
    			if(e) throw(e);
    			res.json(airport);
    		});
    	});
    },
};

