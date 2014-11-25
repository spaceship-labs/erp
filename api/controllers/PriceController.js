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
			},function(companies,cb){
				Airport.find().exec(function(e,airports){ cb(e,companies,airports) })
			},function(companies,airports,cb){
				Service.find().exec(function(e,services){ cb(e,companies,airports,services) })
			},function(companies,airports,services,cb){
				Zone.find().exec(function(e,zones){ cb(e,companies,airports,services,zones) })
			},function(companies,airports,services,zones,cb){
				Price.find({ 'service':services[0]._id , 'company':companies[0]._id }).exec(function(e,prices){ cb(e,companies,airports,services,zones,prices) })
			},
		];
		async.waterfall(reads,function(e,companies,airports,services,zones,prices){
			//if(e) throw(e);
			//Price.find({ 'service':services[0]._id , 'company':companies[0]._id }).exec(function(e,prices){
				Common.view(res.view,{
					prices:prices,
					airports : airports,
					services:services,
					companies:companies,
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
	create : function(req,res){}
};

