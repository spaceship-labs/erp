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
		//if(form.product_type=='room') formatRooms(form.rooms);
		CompanyProduct.create(form).exec(function(err,cp){
			if(err) res.json( false );
			CompanyProduct.findOne(cp.id).populateAll().exec(function(err,cp){
				if(cp.product_type == 'transfer')
					getTransferPrices(cp,res,true);
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
		delete params.id;
		delete params.skip;
		CompanyProduct.find(params).populateAll().skip(skip).exec(function(err,cp){
			if(err) res.json( err );
			if(params.product_type == 'transfer'){
				getTransferPrices(cp,res,false);
			}else{
				res.json( cp );
			}
		});
	}
	,update : function(req,res){
		var form = req.params.all();
		CompanyProduct.update({id : form.id},form).exec(function(err,cp){
			if (err) return res.json(err);
			return res.json(cp);
		});
	}
	,removeproduct : function(req,res){
		var params = req.params.all();
		CompanyProduct.destroy({id:params.id}).exec(function(e,r){
			if(e) throw(e);
			res.json(r);
		})
	}
};
var getTransferPrices = function(pricesC,res,single){
	if(pricesC){
		var ids = [];
		if(single)
			ids.push(pricesC.transfer.id);
		else
			for(x in pricesC) ids.push( pricesC[x].transfer.id );
		//console.log(ids);
		TransferPrice.find({ transfer : ids }).populateAll().exec(function(err,prices){
			//console.log(prices);
			result = _.groupBy(prices, function(price){ return price.transfer.id; });
			res.json(result);
		});
	}
}