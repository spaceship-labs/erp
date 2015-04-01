/**
 * LostandfoundController
 *
 * @description :: Server-side logic for managing lostandfounds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Lostandfound.find().populate('user').populate('order').exec(function(e,laf){
			async.mapSeries( laf, function(item,cb) {
		      	Client_.findOne(item.order.client).exec(function(err,c){
			      	item.order.client = c;cb(err,item);
			    });
		    },function(err,results){
		    	Common.view(res.view,{
					lostandfounds:results,
					page:{
						name:'Objetos perdidos'
						,icon:'fa fa-question'
						,controller : 'lostandfound.js'
					},
					breadcrumb : [
						{label : 'Objetos perdidos' }
					]
				},req);
		    });
		});
	},
	newitem : function(req,res){
		//Lostandfound.find().exec(function(e,laf){
			Common.view(res.view,{
				lostandfounds : [],
				page:{
					name:'Objetos perdidos'
					,icon:'fa fa-question'
					,controller : 'lostandfound.js'
				},
				breadcrumb : [
					{label : 'Objetos perdidos' }
				]
			},req);
		//});
	},
	edit : function(req,res){
		Lostandfound.findOne(req.params.id).exec(function(e,lostandfound){
			Common.view(res.view,{
				lostandfound:lostandfound,
				page:{
					name:'Objetos perdidos'
					,icon:'fa fa-question'
					,controller : 'lostandfound.js'
				},
				breadcrumb : [
					{label : 'Objetos perdidos' , url : '/lostandfound/' }
				]
			},req);
		});
	},
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
		Lostandfound.update({id:id},form,function(e,lostandfound){
    		Lostandfound.findOne(id).exec(function(e,lostandfound){
    			if(e) throw(e);res.json(lostandfound);
    		});
    	});
	},
	create : function(req,res){
		var item = req.params.all();
		delete item.id;
		item.req = req;
		Lostandfound.create(item).exec(function(e,laf){
			if(e) return res.json(false);
			res.json(laf);
		});
	}
};

