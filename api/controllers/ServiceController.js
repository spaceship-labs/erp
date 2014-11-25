/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Service.find().sort('name').exec(function(e,services){
			Common.view(res.view,{
				services:services,
				page:{
					name:'Servicios'
					,icon:'fa fa-car'
					,controller : 'service.js'
				},
				breadcrumb : [
					{label : 'Servicios'}
				]
			},req);
		});
	},
	edit : function(req,res){
		Service.findOne(req.params.id).exec(function(e,service){
			if(e) return res.redirect("/service/");
			Common.view(res.view,{
				service:service,
				page:{
					name:service.name,
					icon:'fa fa-car',
					controller : 'service.js'
				},
				breadcrumb : [
					{label : 'Servicios', url: '/service/'},
					{label : service.name},
				]
			},req);	
		});
	},
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	Service.update({id:id},form,function(e,service){
    		if(e) throw(e);
    		Service.findOne(service[0].id).exec(function(e,service){
    			if(e) throw(e);
    			res.json(service);
    		});
    	});
	}
};