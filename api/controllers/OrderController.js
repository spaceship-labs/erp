/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
module.exports = {
  index: function (req, res) {
    //Order.find(params).sort('createdAt desc').populate('client').populate('reservations').populate('user').populate('company').exec(function(e,orders){
    Order.find().where(Common.getCompaniesForSearch(req.user)).sort('createdAt desc').populate('client').populate('reservations').populate('user').populate('company').exec(function(e,orders){
  		Common.view(res.view,{
  			orders : formatOrders(orders),
  			page:{
  				name:req.__('sc_reservations')
  				,icon:'fa fa-car'		
  				,controller : 'order.js'
  			},
  			breadcrumb : [
  				{label : req.__('sc_reservations')}
  			]
  		},req);
  	});
  },
  neworder : function(req,res){
    var select_company = req.session.select_company || req.user.select_company;
  	Client_.find({company:select_company}).sort('name').exec(function(e,clients_){ Hotel.find().sort('name').populate('location').populate('rooms').exec(function(e,hotels){ Tour.find().sort('name').exec(function(e,allTours){
  			Common.view(res.view,{
  				clients_ : clients_ ,
  				hotels:hotels ,
  				transfers : [] ,
          allTours : allTours ,
  				page:{
  					name:req.__('sc_reservations')
  					,icon:'fa fa-car'		
  					,controller : 'order.js'
  				},
  				breadcrumb : [
  					{label : req.__('sc_reservations')}
  				]
  			},req);
  		});
    }); });
  },
  getorder : function(req,res){
    console.log(req.user);
    Order.find().where(Common.getCompaniesForSearch(req.user)).sort('createdAt desc').populate('reservations').populate('user').exec(function(e,orders){
      if(err) return res.json(false);
      res.json(orders);
    });
  },
	createClient : function(req,res){
      var form = Common.formValidate(req.params.all(),['name','address','phone','rfc']);
      if(form){
          form.user = req.user.id;
          form.company = req.session.select_company || req.user.select_company;
          Client_.create(form).exec(function(err,client_){
              if(err) return res.json(false);
              return res.json(client_);
          });
      }
  },
  createOrder : function(req,res){
    var params = req.params.all();
    params.user = req.user.id;
    params.company = req.session.select_company || req.user.select_company;
    params.req = req;
    Order.create(params).exec(function(err,order){
        if(err) return res.json(false);
        return res.json(order);
    });
  },
  createReservation : function(req,res){
  	//var requided = ['hotel','airport','transfer','state','payment_method','pax','fee','origin','type','fee'];
  	var params = req.params.all();
  	params.hotel = params.hotel.id;
  	params.state = params.state.handle;
  	params.payment_method = params.payment_method.handle;
  	//params.transfer = params.transfer.id;
    params.airport = params.airport.id;
  	params.client = params.client.id;
    params.user = req.user.id;
    params.company = req.session.select_company || req.user.select_company;
    //params.req = {};
    //params.req.user = req.user || false;
    //params.req.session = req.session || false;
    //params.req.options = req.options || false;
    //console.log(params);
		//var fee = calculateFee(params.fee);
    //var form = Common.formValidate(params,requided);
    Reservation.create(params).exec(function(err,reservation){
      if(err) return res.json(err);
      return res.json(reservation);
    });
  },
  createReservationTour : function(req,res){
    var params = req.params.all();
    async.mapSeries( params.items, function(item,cb) {
      item.order = params.order;
      //item.req = req;
      Reservation.create(item).exec(function(err,r){
        item.id = r.id; cb(err,item);
      });
    },function(err,results){
      return res.json(results);
    });
  },
  updateReservation : function(req,res){
    var params = req.params.all();
    items = params.items || [];
    async.mapSeries( items, function(item,cb) {
      //item.req = req;
      var id = item.id;
      item.hotel = item.hotel.id;
      delete item.id;
      Reservation.update({id:id},item,function(err,r){
        cb(err,r);
      });
    },function(err,results){
      return res.json(results);
    });
  },
  edit : function(req,res){
    Order.findOne( req.params.id ).populate('reservations').exec(function(err,order){
      Reservation.find({ 'order' : req.params.id })
        .populate('hotel').populate('tour').populate('airport').populate('client').exec(function(err,reservations){
        Client_.find().sort('name').exec(function(e,clients_){ 
          Client_.findOne(order.client).populate('contacts').exec(function(e,theclient){ 
          Transfer.find().sort('name').exec(function(e,transfers){ Hotel.find().sort('name').populate('location').populate('rooms').exec(function(e,hotels){
            order.reservations = reservations || [];
            Common.view(res.view,{
              order : order, 
              clients_ : clients_ ,
              theclient : theclient ,
              hotels : hotels , 
              transfers : transfers ,
              page:{
                name:req.__('sc_reservations')
                ,icon:'fa fa-car'
                ,controller : 'order.js'
              },
              breadcrumb : [
                { label : req.__('sc_reservations') , url : '/order/' } , 
                { label : order.id }
              ]
            },req);
          }); }); // transfer / hotel 
        }); }); // client
      });//reservation
    });
  },
  /*
  * Obitien los transfers disponibles dependiendo de si está activo el precio
  * Recibe las 2 zonas para la búsqueda
  */
  getAvailableTransfers : function(req,res){
    var params = req.params.all();
    if( params.zone1 && params.zone2 ){
      TransferPrice.find({ 
        company : req.user.default_company,
        active : true, 
        "$or":[ { 
          "$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] , 
          "$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] 
        }] 
      }).populate('transfer').exec(function(err,prices){
        if(prices)
          return res.json(prices);
        else
          return res.json(false);
      });
    }else{
      return res.json(false);
    }
  }
};
function formatOrders(orders){
  var result = false;
  if( orders.length > 0 ){
    for(var x in orders){
        var transfer = false;
        for( var j in orders[x].reservations ){
            var r = orders[x].reservations[j];
            if( r.reservation_type == 'transfer' ){
                transfer = r;
            }
        }
        orders[x].transfer = transfer;
    }
    result = orders;
  }
  return result;
}
function calculateFee(fee){
	return fee;
}
function getRequiredFields(requided,fields){
	return fields;
}