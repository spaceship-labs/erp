/**
 * TransferPriceController
 *
 * @description :: Server-side logic for managing prices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
async = require('async');
module.exports = {
	index : function(req,res){
		var reads = [
			function(cb){
				Company.find().exec(cb)//{ id : req.user.default_company }
			},function(companies_,cb){
				Airport.find().populate('location').exec(function(e,airports){ cb(e,companies_,airports) })
			},function(companies_,airports,cb){
				Transfer.find().exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
			},function(companies_,airports,transfers,cb){
				Location.find().populate('zones').exec(function(e,locations){ cb(e,companies_,airports,transfers,locations) })
			},function(companies_,airports,transfers,locations,cb){
				TransferPrice.find({
						company : req.user.default_company , 
						transfer : transfers[0].id , 
						"$or" : [
							{'location' : locations[0].id}, 
							{'location2' : locations[0].id} 
						]
					}).sort('zone1') //.limit(1000)
					.populate('zone1').populate('zone2').populate('transfer').populate('location').populate('location2')
					.exec(function(e,prices){ cb(e,companies_,airports,transfers,locations,prices) })
			},
		];
		async.waterfall(reads,function(e,companies_,airports,transfers,locations,prices){
			if(e) throw(e);
			Common.view(res.view,{
				thelocation : locations[0],
				locations_:locations,
				prices:addPricesOnCompany( false , prices ),
				airports : airports,
				transfers:transfers,
				companies_:companies_,
				thecompany : req.user.default_company,
				_content:sails.config.content,
				page:{
					name : 'Precios',
					icon : 'fa fa-money',
					controller : 'price.js',
				}
			},req);
		});
	},
	find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		var limit = params.limit || 200;
		if( typeof params.id == 'undefined' ) delete params.id;
		delete params.skip;
		delete params.limit;
		TransferPrice.find(params)
			.sort('zone1').limit(limit).skip(skip)
			.populate('zone1').populate('zone2').populate('transfer').populate('company')
			.exec(function(e,prices){ 
				if(e) throw(e);
				TransferPrice.find(params).exec(function(e,count){ 
					res.json({ results : prices, count : count });
				});
			});
	},
	getPrices : function(req,res){
		var condiciones = req.params.all();
		console.log(condiciones);
		TransferPrice.find({ 
				//company:req.user.default_company ,
				company : condiciones.company ,
				transfer : condiciones.transfer , 
				"$or" : [
					{ 'location' : condiciones.location }, 
					{ 'location2' : condiciones.location } 
				]
			})
			.sort('zone1')
			.populate('zone1').populate('zone2').populate('transfer').populate('location').populate('location2')
			.exec(function(e,prices){ 
				if(e) throw(e);
				res.json(addPricesOnCompany( false , prices ));
			});
	},
	updatePrice : function(req,res){
		var params = req.params.all();
		console.log(params);
		TransferPrice.update({id:params.id},params,function(e,price){
			if(e) throw(e);
			res.json(price);
		});
	},
	createCustom : function(req,res){
		var params = req.params.all();
		var companyID = params.companyID;
		var transferID = params.transferID;
		var reads = [
			function(cb){
				if( companyID )
					Company.find({ id : companyID }).exec(cb)
				else
					Company.find().exec(cb)
			},function(companies_,cb){
				Airport.find().populate('location').exec(function(e,airports){ cb(e,companies_,airports) })
			},function(companies_,airports,cb){
				if( transferID )
					Transfer.find({ id : transferID }).exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
				else
					Transfer.find().exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
			},function(companies_,airports,transfers,cb){
				Location.find().populate('zones').populate('locations').exec(function(e,locations){ cb(e,companies_,airports,transfers,locations) })
			},function(companies_,airports,transfers,locations,cb){
				/*TransferPrice.find()
					.populate('zone1').populate('zone2')
					.exec(function(e,prices){ cb(e,companies_,airports,transfers,locations,prices) })*/
				var prices = [];
				cb(false,companies_,airports,transfers,locations,prices)
			},
		];
		async.waterfall(reads,function(e,companies_,airports,transfers,locations,prices){
			//res.json(transfers);
			Transferprices.createTransferPrices(locations,transfers,companies_,function(){
				res.json({
					prices : prices ,
					locations : locations ,
					airports : airports ,
					transfers : transfers ,
					companies_ : companies_ 
				});
			});
		});
	},
	createAll : function(req,res){
		var companyID = req.params.id;
		var reads = [
			function(cb){
				if( companyID )
					Company.find({ id : companyID }).exec(cb)
				else
					Company.find().exec(cb)
			},function(companies_,cb){
				Airport.find().populate('location').exec(function(e,airports){ cb(e,companies_,airports) })
			},function(companies_,airports,cb){
				Transfer.find().exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
			},function(companies_,airports,transfers,cb){
				Location.find().populate('zones').populate('locations').exec(function(e,locations){ cb(e,companies_,airports,transfers,locations) })
			},function(companies_,airports,transfers,locations,cb){
				TransferPrice.find()
					.populate('zone1').populate('zone2')
					.exec(function(e,prices){ cb(e,companies_,airports,transfers,locations,prices) })
			},
		];
		async.waterfall(reads,function(e,companies_,airports,transfers,locations,prices){
			Transferprices.createTransferPrices(locations,transfers,companies_,function(){
				Common.view(res.view,{
					prices : prices ,
					locations : locations ,
					airports : airports ,
					transfers : transfers ,
					companies_ : companies_ ,
					_content : sails.config.content ,
					page:{
						name : 'Precios',
						icon : 'fa fa-money',
						controller : 'price.js',
					}
				},req);
			});
		});
	}
};
function addPricesOnCompany( companies , prices ){
	result = _.groupBy(prices, function(price){ return price.transfer.id; });
	return result;
}