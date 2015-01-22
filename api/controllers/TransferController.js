/**
 * TransferController
 *
 * @description :: Server-side logic for managing Transfers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index : function(req,res){
		Transfer.find().sort('name').exec(function(e,transfers){
			Common.view(res.view,{
				transfers:transfers,
				page:{
					name:'Traslados'
					,icon:'fa fa-car'
					,controller : 'transfer.js'
				},
				breadcrumb : [
					{label : 'Traslados'}
				]
			},req);
		});
	},
	edit : function(req,res){
		Transfer.findOne(req.params.id).exec(function(e,transfer){
			if(e) return res.redirect("/transfer/");
			Common.view(res.view,{
				transfer:transfer,
				page:{
					name:transfer.name,
					icon:'fa fa-car',
					controller : 'transfer.js'
				},
				breadcrumb : [
					{label : 'Traslados', url: '/transfer/'},
					{label : transfer.name},
				]
			},req);	
		});
	},
	update : function(req,res){
		var form = req.params.all();
    	var id = form.id;
    	Transfer.update({id:id},form,function(e,transfer){
    		if(e) throw(e);
    		Transfer.findOne(transfer[0].id).exec(function(e,transfer){
    			if(e) throw(e);
    			res.json(transfer);
    		});
    	});
	}
};