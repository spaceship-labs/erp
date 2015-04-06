/**
 * ClaimController
 *
 * @description :: Server-side logic for managing claims
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Claim.find().populate('user').populate('order').exec(function(e,claims){
			async.mapSeries( claims, function(item,cb) {
		      	Client_.findOne(item.order.client).exec(function(err,c){
			      	item.order.client = c;cb(err,item);
			    });
		    },function(err,results){
		    	Common.view(res.view,{
					claims:results,
					page:{
						name:'Quejas'
						,icon:'fa fa-exclamation'
						,controller : 'claim.js'
					},
					breadcrumb : [
						{label : 'Quejas' }
					]
				},req);
		    });
		});
	},
	newitem : function(req,res){
		//Claim.find().exec(function(e,laf){
			console.log(req.options);
			Common.view(res.view,{
				claims : [],
				page:{
					name:'Quejas'
					,icon:'fa fa-exclamation'
					,controller : 'claim.js'
				},
				breadcrumb : [
					{label : 'Quejas' }
				]
			},req);
		//});
	},
	edit : function(req,res){
		Claim.findOne(req.params.id).exec(function(e,claim){
			Common.view(res.view,{
				claim:claim,
				page:{
					name:'Quejas'
					,icon:'fa fa-exclamation'
					,controller : 'claim.js'
				},
				breadcrumb : [
					{label : 'Quejas' , url : '/claim/' }
				]
			},req);
		});
	},
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
		Claim.update({id:id},form,function(e,claim){
    		Claim.findOne(id).exec(function(e,claim){
    			if(e) throw(e);res.json(claim);
    		});
    	});
	},
	create : function(req,res){
		var item = req.params.all();
		delete item.id;
		item.req = req;
		Claim.create(item).exec(function(e,claim){
			if(e) return res.json(false);
			res.json(claim);
		});
	}
};

