/**
 * Company_productController
 *
 * @description :: Server-side logic for managing company_products
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
	addproducttocompany : function(req,res){
		var form = req.params.all();
		delete form.id;
		var location = params.location || false;
		delete params.location;
		//if(form.product_type=='room') formatRooms(form.rooms);
		CompanyProduct.create(form).exec(function(err,cp){
			if(err) res.json( false );
			CompanyProduct.findOne(cp.id).populateAll().exec(function(err,cp){
				if(cp.product_type == 'transfer')
					getTransferPrices(cp,res,true,location);
				else
					res.json( cp );
			});
		});
	}
	/*
		Debe recibir:
		- agency
		- product_type
	*/
	,find : function(req,res){
		var params = req.params.all();
		var skip = params.skip || 0;
		if( typeof params.id == 'undefined' ) delete params.id;
		delete params.skip;
		var location = params.location || false;
		delete params.location;
		CompanyProduct.find(params).populateAll().skip(skip).exec(function(err,cp){
			if(err) res.json( err );
			if(params.product_type == 'transfer')
				getTransferPrices(cp,res,false,location);
			else
				res.json( cp );
		});
	}
	,update : function(req,res){
		var form = req.params.all();
		CompanyProduct.update({id : form.id},form).exec(function(err,cp){
			if (err) return res.json(err);
			return res.json(cp);
		});
	}
	,updatetrnaspricebyfilter : function(req,res){
		var params = req.params.all();
	}
	,updatetourbyfilter : function(req,res){
		var params = req.params.all();
		var fields = {};
		var commission = parseInt(params.commission_agency);
		if( commission != 0 ){
			if( params.adultBase && params.adultBase != '' ){
				fields.fee = {};
				fields.fee[ params.adultBaseSign?'<':'>' ] = parseFloat(params.adultBase);
			}
			if( params.childBase && params.childBase != '' ){
				fields.feeChild = {};
				fields.feeChild[ params.childBase?'<':'>' ] = parseFloat(params.childBase);
			}
			if( params.tlocation )
				fields.location = params.tlocation;
			CompanyProduct.find({ product_type : 'tour'}).exec(function(err,findTours){
				if (err) return res.json(err);
				var toursIDs = [];
				for(var x in findTours ) toursIDs.push( findTours[x].tour );
				fields.id = toursIDs;
				Tour.find(fields).exec(function(t_err,tours){
					if(t_err) return res.json(t_err);
					var toursIDs = [];
					for(var x in tours ) toursIDs.push( tours[x].id );
					CompanyProduct.find({ tour : toursIDs }).populateAll().exec(function(cp_err,cps){
					  async.mapSeries( cps, function(item,callback) {
					  	item.tour.fee = parseInt(item.tour.fee) || 0;
					  	item.tour.feeChild = parseInt(item.tour.feeChild) || 0;
					    var fieldsToUpdate = {
					      commission_agency : commission
					      ,fee :  item.tour.fee - ( item.tour.fee * ( commission / 100 ) ) 
					      ,feeChild :  item.tour.feeChild - ( item.tour.feeChild * ( commission / 100 ) )
					    };
					    CompanyProduct.update({ id:item.id } , fieldsToUpdate ).exec(function(cpu_err,cpUpdated){
					      callback(cpu_err,cpUpdated);
					    });
					  },function(err,results){
					    if (err) return res.json(err);
					    return res.json(results);
					  });
					});
				});
			});
		}
	}
	,removeproduct : function(req,res){
		var params = req.params.all();
		CompanyProduct.destroy({id:params.id}).exec(function(e,r){
			if(e) throw(e);
			res.json(r);
		})
	}
};
var getTransferPrices = function(pricesA,res,single,location){
	if(pricesA){
		var ids = [];
		if(single)
			ids.push(pricesA.transfer.id);
		else
			for(x in pricesA) ids.push( pricesA[x].transfer.id );
		TransferPrice.find({ transfer : ids , location : location }).populateAll().exec(function(err,prices){
			//console.log(prices);
			result = _.groupBy(prices, function(price){ return price.transfer.id; });
			res.json(result);
		});
	}
}
var getHotelPrices = function(pricesA,res,single){
	if(pricesA){
		var ids = [];
		if(single)
			ids.push(pricesA.hotel.id);
		else
			for(x in pricesA) ids.push( pricesA[x].transfer.id );
	}
}