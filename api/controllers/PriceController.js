/**
 * PriceController
 *
 * @description :: Server-side logic for managing prices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

async = require('async');
module.exports = {
	index : function(req,res){
		var reads = [
			function(cb){
				Company.find().exec(cb)
			},function(companies_,cb){
				Airport.find().populate('location').exec(function(e,airports){ cb(e,companies_,airports) })
			},function(companies_,airports,cb){
				Service.find().exec(function(e,services){ cb(e,companies_,airports,services) })
			},function(companies_,airports,services,cb){
				Zone.find().exec(function(e,zones){ cb(e,companies_,airports,services,zones) })
			},function(companies_,airports,services,zones,cb){
				Price.find({ 'service':services[0].id,'company':companies_[0].id,'airport':airports[0].id })
					.populate('zone')
					.exec(function(e,prices){ cb(e,companies_,airports,services,zones,prices) })
			},
		];
		async.waterfall(reads,function(e,companies_,airports,services,zones,prices){
			if(e) throw(e);
			//Price.find({ 'service':services[0]._id , 'company':companies_[0]._id }).exec(function(e,prices){
				Common.view(res.view,{
					prices:prices,
					airports : airports,
					services:services,
					companies_:companies_,
					zones:zones,
					_content:sails.config.content,
					page:{
						name : 'Precios',
						icon : 'fa fa-money',
						controller : 'price.js',
					}
				},req);
			//});
		});
	},
	getPrices : function(req,res){
		condiciones = req.params.all();
		Price.find({ 'service':condiciones.service,'company':condiciones.company,'airport':condiciones.airport })
			.populate('zone')
			.exec(function(e,prices){ 
				if(e) throw(e);
				res.json(prices)
			});
	}
};

