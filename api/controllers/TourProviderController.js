/**
 * TourProviderController
 *
 * @description :: Server-side logic for managing Tourproviders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		TourProvider.find().exec(function(e,providers){
			Location.find().exec(function(e,locations){
				if(e) throw(e);
				Common.view(res.view,{
					providers : providers
					,locations:locations
					,page:{
						name : "Proveedores de Tours",
						icon:'fa fa-compass',
						controller : 'tourprovider.js'
					}
					,breadcrumb : [
						{label : 'Proveedores'}
					]
				},req);
			});
		});
	},edit : function(req,res){
		TourProvider.findOne(req.params.id).populate('tours').exec(function(e,provider){
			if(e) throw(e);
			Location.find().exec(function(e,locations){
				Common.view(res.view,{
					provider:provider
					,locations:locations
					,page:{
						name : "Proveedores de Tours",
						icon:'fa fa-compass',
						controller : 'tourprovider.js'
					}
					,breadcrumb : [
						{label : 'Proveedores' , url : '/tourprovider/'}
						,{ label : provider.name }
					]
				},req);
			});
		});
	}
	,update : function(req,res){
    	var form = req.params.all();
    	var id = form.id;
    	delete form.id;
    	TourProvider.update({id:id},form,function(e,provider){
    		if(e) throw(e);
    		TourProvider.findOne(provider[0].id).exec(function(e,provider){
    			if(e) throw(e);
    			res.json(provider);
    		});
    	});
    }
};

