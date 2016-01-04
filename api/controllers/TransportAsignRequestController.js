/**
 * TransportAsignRequestController
 *
 * @description :: Server-side logic for managing Transportasignrequests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function(req, res){
        Company.find().populate('base_currency').exec(function(err, companies){ Location.find().populate('zones').exec(function(err,locations){
            Common.view(res.view,{
                select_view: 'transportasign/request',
                type: 'request',
                companies: companies,
                locations : locations,
                page:{
                    name:req.__('request'),
                    icon:'fa fa-clock-o',
                    controller : 'transportasign.js'
                },
                breadcrumb : [
                    {label : req.__('sc_transfer')}
                ]
            },req);
        }); });
    },
    getprices : function(req,res){
        var params = req.params.all();
        if( params.zone1 && params.zone2 ){
          var company = params.company?params.company:( req.user.select_company || req.session.select_company );
          if( typeof company == 'string' ){
            Company.findOne(company).exec(function(err,company){
                customGetAvailableTransfers(company,params,res);
            });
          }else{
            customGetAvailableTransfers(company,params,res);
          }
        }else{
          return res.json(false);
        }
    },
};
function customGetAvailableTransfers(company,params,res){
  //console.log('company');console.log(company);
  if(company.adminCompany){
    TransferPrice.find({ 
      company : company.id
      ,active : true
      ,"$or":[ 
        { "$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] } , 
        { "$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] } 
      ] 
    }).populate('transfer').exec(function(err,prices){
      //console.log('prices admin');console.log(prices);
      if(prices)
        return res.json(prices);
      else
        return res.json(false);
    });
  }else{
    CompanyProduct.find({agency : company.id,product_type:'transfer'}).exec(function(cp_err,products){
      var productsArray = [];
      for(var x in products) productsArray.push( products[x].transfer );
      TransferPrice.find({ 
        company : company.id
        ,active : true
        ,transfer : productsArray
        ,"$or":[ 
          { "$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] } , 
          { "$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] } 
        ] 
      }).populate('transfer').exec(function(err,prices){
        //console.log('prices NO admin');console.log(prices);
        if(prices)
          return res.json(prices);
        else
          return res.json(false);
      });
    });
  }
}