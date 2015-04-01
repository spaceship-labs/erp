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
					name:req.__('sc_transfer')
					,icon:'fa fa-car'
					,controller : 'transfer.js'
				},
				breadcrumb : [
					{label : req.__('sc_transfer')}
				]
			},req);
		});
	},
	create : function(req,res){
		var reads = [
			function(cb){
				var form = req.params.all();
				Transfer.create(form).exec(cb)
			},function(transfer,cb){
				Company.find().exec(function(e,companies_){ cb(e,transfer,companies_) })
			},function(transfer,companies_,cb){
				Location.find().populate('zones').exec(function(e,locations_){ cb(e,transfer,companies_,locations_) })
			},
		];
		async.waterfall(reads,function(e,transfer,companies_,locations_){
			if(e) throw(e);
			var transfers = [];transfers.push(transfer);
			Transferprices.createTransferPrices(locations_,transfers,companies_,function(){
				res.json(transfer);
			});
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
					{label : req.__('sc_transfer'), url: '/transfer/'},
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
	},
    updateIcon: function(req,res){
        form = req.params.all();
        Transfer.updateAvatar(req,{
            dir : 'transfers',
            profile: 'avatar',
            id : form.id,
        },
        function(e,tour){
            if(e) console.log(e);
            res.json(tour);
        });
	},
};
