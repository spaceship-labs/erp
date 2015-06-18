/**
 * AirlineController
 *
 * @description :: Server-side logic for managing Airlines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Airline.find().sort('name DESC').exec(function(e,airlines){
			if(e) throw(e);
			Common.view(res.view,{
				airlines : airlines,
				page:{
					name:req.__('airlines')
					,description: req.__('airlines')
					,icon:'fa fa-plane'
					,controller : 'Airline.js'
				},
				breadcrumb : [
					{label : req.__('airlines')}
				]
			},req);
		});
	},
	edit : function(req,res){
		Airline.findOne(req.params.id).exec(function(e,airline){
			if(e) throw(e);
			Common.view(res.view,{
				airline : airline,
				page:{
					name:req.__('airline')+': ' + airline.name
					,description: req.__('airlines')
					,icon:'fa fa-plane'
					,controller : 'Airline.js'
				},
				breadcrumb : [
					{label : req.__('airlines'),url : '/airline/'},
					{label : airline.name}
				]
			},req);
		})
	},
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	Airline.update({id:id},form,function(e,airline){
    		if(e) throw(e);
    		Airline.findOne(airline[0].id).exec(function(e,airline){
    			if(e) throw(e);
    			res.json(airline);
    		});
    	});
	}
};