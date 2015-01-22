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
				Transfer.find().exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
			},function(companies_,airports,transfers,cb){
				Zone.find().exec(function(e,zones){ cb(e,companies_,airports,transfers,zones) })
			},function(companies_,airports,transfers,zones,cb){
				//,'company':companies_[0].id
				Price.find({ 'transfer':transfers[0].id,'airport':airports[0].id })
					.populate('zone')
					.exec(function(e,prices){ cb(e,companies_,airports,transfers,zones,prices) })
			},
		];
		async.waterfall(reads,function(e,companies_,airports,transfers,zones,prices){
			if(e) throw(e);
			//Price.find({ 'transfer':transfers[0]._id , 'company':companies_[0]._id }).exec(function(e,prices){
				companies_ = addPricesOnCompany( companies_ , prices );
				Common.view(res.view,{
					prices:prices,
					airports : airports,
					transfers:transfers,
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
		//,'company':condiciones.company
		Price.find({ 'transfer':condiciones.transfer,'airport':condiciones.airport })
			.populate('zone')
			.exec(function(e,prices){ 
				if(e) throw(e);
				res.json(prices)
			});
	},
	updatePrice : function(req,res){
		var params = req.params.all();
		console.log(params.id);
		Price.update({id:params.id},params,function(e,price){
			if(e) throw(e);
			res.json(price);
		});
	}
};
function addPricesOnCompany( companies , prices ){
	for( i in companies ){
		companies[i].prices = [];
		for( j in prices ){
			if( prices[j].company == companies[i].id )
				companies[i].prices.push( prices[j] );
		}
	}
	return companies;
}