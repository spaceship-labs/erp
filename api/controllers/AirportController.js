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
					zones:[],
					page:{
						name : req.__('sc_airport')
						,icon : 'fa fa-plane'		
						,controller : 'airport.js'
					},
					breadcrumb : [
						{label : req.__('sc_airport') }
					]
				},req);
			});
		});
	},
	edit : function(req,res){
		var namelang = req.getLocale()=='es'?'name':'name_es';
		Airport.findOne(req.params.id).exec(function(e,airport){
			Location.find().sort('name').exec(function(e,locations){
				Zone.find({ 'location' : airport.location }).exec(function(e,zones){
					if(e) return res.redirect("/airport/");
					Common.view(res.view,{
						airport:airport,
						locations:locations,
						zones:zones,
						page:{
							name:airport[namelang],
							icon:'fa fa-plane',
							controller : 'airport.js'
						},
						breadcrumb : [
							{label : req.__('sc_airport'), url: '/airport/'},
							{label : airport.name},
						]
					},req);
				});
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
    getZones : function(req,res){
		params = req.params.all();
		Zone.find({ 'location' : params.id }).exec(function(e,zones){ 
			if(e) throw(e);
			res.json(zones);
		});
	},
	getAirport : function(req,res){
		var params = req.params.all();
		Airport.find({ 'location' : params.id }).exec(function(e,airports){ 
			if(e) throw(e);
			res.json(airports);
		});
	}
};

