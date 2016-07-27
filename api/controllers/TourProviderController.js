/**
 * TourProviderController
 *
 * @description :: Server-side logic for managing Tourproviders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		TourProvider.find().exec(function(e,providers){
			if(e) throw(e);
			Location.find().exec(function(e,locations){
				if(e) throw(e);
				Currency.find().exec(function(err,currencies){
					if(err) throw(err);
					Common.view(res.view,{
						providers : providers
						,locations:locations
						,currencies:currencies || []
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
		});
	},edit : function(req,res){
		TourProvider.findOne(req.params.id).populate('tours').exec(function(e,provider){
			if(e) throw(e);
			Location.find().populate('hotels').populate('zones').exec(function(e,locations){
                TourCategory.find().exec(function(e,tourcategories){
				//sails.controllers.admin.currenciesJson(req,res,function(currencies){
                    Currency.find().exec(function(err,currencies){
                        Common.view(res.view,{
                            provider:provider
                            ,locations:locations
                            ,currencies : currencies
                            ,tourcategories : tourcategories
                            ,page:{
                                name : "Proveedores de Tours",
                                icon:'fa fa-compass',
                                controller : 'tourprovider.js'
                            }
                            ,breadcrumb : [
                                {label : 'Proveedores' , url : '/tourprovider/'}
                                ,{ label : provider.name || '' }
                            ]
                        },req);
                    });
			    });
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
    ,find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		var limit = params.limit || 10;
		if( typeof params.id == 'undefined' ) delete params.id;
		delete params.skip;
		delete params.limit;
        if(params.name) params.name = new RegExp(params.name,"i");
        TourProvider.find(params).skip(skip).limit(limit).populate('tours').exec(function(e,providers){
        	if(e) res.json('err');
        	TourProvider.count(params).exec(function(e,count){
        		if(e) res.json('err');
            	res.json({ results : providers , count : count });
        	});
        });
	}
};

