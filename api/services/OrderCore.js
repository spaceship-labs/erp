/*
	Create section 
		create order
		create reservations transfers and tours/hotels
*/
module.exports.createOrder = function(params, req , callback){
    params.user = req.user.id;
    params.company = params.company?params.company:(req.session.select_company || req.user.select_company);
    params.reservation_method = 'intern';
    params.req = req;
    params.reservations = [];
    delete params.id;
    Order.create(params).exec(callback);
};
module.exports.createTransferReservation = function(){};
module.exports.getCompaniesReservation = function(){}
/*
	Prices section:
		getAvailableTransfers
		getTransferPrice: obtiene el precio de cobro y el precio de la empresa principal
*/
module.exports.getTransferPrice = function(zone1,zone2,transfer,company,mainCompany,callback){
	TransferPrice.findOne({ company : company, active : true, transfer : transfer
      	,"$or" : [ 
        	{ "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
        	{ "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
      	] 
    }).populate('transfer').exec(function(err,price1){
    	if( company == mainCompany )
    		callback(err,{ price : price1, mainPrice: false });
    	else{
    		TransferPrice.findOne({ company : mainCompany, active : true, transfer : transfer
		      	,"$or" : [ 
		        	{ "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
		        	{ "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
		      	] 
		    }).populate('transfer').exec(function(err,mainPrice){
		    	callback(err,{ price : price1, mainPrice: mainPrice });
		    });
    	}
    });
}
module.exports.getAvailableTransfers = function(zone1,zone2,company,callback){
	if(company.adminCompany){
	    TransferPrice.find({ 
	      company : company.id
	      ,active : true
	      ,"$or":[ 
	        { "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
	        { "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
	      ] 
	    }).populate('transfer').exec(callback);
	}else{
	    CompanyProduct.find({agency : company.id, product_type:'transfer'}).exec(function(cp_err,products){
	      var productsArray = [];
	      for(var x in products) productsArray.push( products[x].transfer );
	      TransferPrice.find({ 
	        company : company.id
	        ,active : true
	        ,transfer : productsArray
	        ,"$or":[ 
	          { "$and" : [{'zone1' : zone1, 'zone2' : zone2}] } , 
	          { "$and" : [{'zone1' : zone2, 'zone2' : zone1}] } 
	        ] 
	      }).populate('transfer').exec(callback);
	    });
	}
};