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
					,controller : 'airline.js'
				},
				breadcrumb : [
					{label : req.__('airlines')}
				]
			},req);
		});
	},
	find : function(req,res){
		var params = req.params.all();
		delete params.id;
        if(params.name) params.name = new RegExp(params.name,"i");
        Airline.find(params).exec(function(err,airlines){
            if(err) res.json('err');
            Airline.count(params).exec(function(e,count){
            	res.json({ results : airlines , count : count });
            });
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