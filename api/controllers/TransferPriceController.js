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
				Company.find({ id : req.user.default_company }).exec(cb)
			},function(companies_,cb){
				Airport.find().populate('location').exec(function(e,airports){ cb(e,companies_,airports) })
			},function(companies_,airports,cb){
				Transfer.find().exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
			},function(companies_,airports,transfers,cb){
				Location.find().populate('zones').exec(function(e,locations){ cb(e,companies_,airports,transfers,locations) })
			},function(companies_,airports,transfers,locations,cb){
				TransferPrice.find({
						company : req.user.default_company , 
						"$or" : [
							{'location' : locations[0].id}, 
							{'location2' : locations[0].id} 
						]
					}).sort('zone1')
					.populate('zone1').populate('zone2').populate('transfer').populate('location').populate('location2')
					.exec(function(e,prices){ cb(e,companies_,airports,transfers,locations,prices) })
			},
		];
		async.waterfall(reads,function(e,companies_,airports,transfers,locations,prices){
			if(e) throw(e);
			//companies_ = addPricesOnCompany( companies_ , prices );
			Common.view(res.view,{
				thelocation : locations[0],
				locations_:locations,
				prices:addPricesOnCompany( false , prices ),
				airports : airports,
				transfers:transfers,
				companies_:companies_,
				_content:sails.config.content,
				page:{
					name : 'Precios',
					icon : 'fa fa-money',
					controller : 'price.js',
				}
			},req);
		});
	},
	getPrices : function(req,res){
		var condiciones = req.params.all();
		console.log(condiciones);
		TransferPrice.find({ 
				company:req.user.default_company ,
				"$or" : [
					{ 'location' : condiciones.location }, 
					{ 'location2' : condiciones.location } 
				]
			})
			.sort('zone1')
			.populate('zone1').populate('zone2').populate('transfer').populate('location').populate('location2')
			.exec(function(e,prices){ 
				if(e) throw(e);
				//companies_ = addPricesOnCompany( companies_ , prices );
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
	createAll : function(req,res){
		var reads = [
			function(cb){
				Company.find().exec(cb)
			},function(companies_,cb){
				Airport.find().populate('location').exec(function(e,airports){ cb(e,companies_,airports) })
			},function(companies_,airports,cb){
				Transfer.find().exec(function(e,transfers){ cb(e,companies_,airports,transfers) })
			},function(companies_,airports,transfers,cb){
				//Zone.find().exec(function(e,zones){ cb(e,companies_,airports,transfers,zones) })
				Location.find().populate('zones').populate('locations').exec(function(e,locations){ cb(e,companies_,airports,transfers,locations) })
			},function(companies_,airports,transfers,locations,cb){
				//,'company':companies_[0].id
				TransferPrice.find()//{ 'transfer':transfers[0].id,'airport':airports[0].id }
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
					//zones:zones,
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
	/*for( i in companies ){
		companies[i].prices = _.where(prices, { company : companies[i].id });
	}
	for( i in companies ){
		//companies[i].pricesByLocation = _.groupBy(companies[i].prices, function(price){ return price.location.id; });
		companies[i].pricesByTransfer = _.groupBy(companies[i].prices, function(price){ return price.transfer.id; });
	}*/
	console.log(prices);
	result = _.groupBy(prices, function(price){ return price.transfer.id; });
	return result;
}
/*function createAllPrices( zones , transfers , company ){
	for( var t in transfers ){
		for( z1 in zones ){
			for(z2 in zones){
				if( z1.id != z2.id ){
					var form = { 
						'one_way' : 0 , 'round_trip' : 0 , active : false ,
						'company' : company , 'transfer' : t.id ,
						'zone1' : z1.id , 'zone2' : z2.id
					}
					TransferPrice.create(form).exec(function(e,price){
						if(e) return res.json({text:e});
						console.log(price);
					})
				}
			}
		}
	}
}*/