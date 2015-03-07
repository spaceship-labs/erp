/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    Order.find().sort('createdAt').populate('reservations').populate('user').populate('company').exec(function(e,orders){
  		Common.view(res.view,{
  			orders : formatOrders(orders),
  			page:{
  				name:'Reservas'
  				,icon:'fa fa-car'		
  				,controller : 'order.js'
  			},
  			breadcrumb : [
  				{label : 'Reservas'}
  			]
  		},req);
  	});
  },
  neworder : function(req,res){
  	Client_.find().sort('name').exec(function(e,clients_){ Hotel.find().sort('name').populate('location').exec(function(e,hotels){
  		Tour.find().sort('name').exec(function(e,allTours){
  			Common.view(res.view,{
  				clients_ : clients_,
  				hotels:hotels,
  				transfers : [], 
          allTours : allTours,
  				page:{
  					name:'Reservas'
  					,icon:'fa fa-car'		
  					,controller : 'order.js'
  				},
  				breadcrumb : [
  					{label : 'Reservas'}
  				]
  			},req);
  		});
    }); });
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
    Order.create(params).exec(function(err,order){
        if(err) return res.json(false);
        return res.json(order);
    });
  },
  createReservation : function(req,res){
  	var requided = ['hotel','airport','transfer','state','payment_method','pax','fee','origin','type','fee'];
  	var params = req.params.all();
  	params.hotel = params.hotel.id;
  	params.state = params.state.handle;
  	params.payment_method = params.payment_method.handle;
  	//params.transfer = params.transfer.id;
    params.airport = params.airport.id;
  	params.client = params.client.id;
    params.user = req.user.id;
    params.company = req.session.select_company || req.user.select_company;
		//var fee = calculateFee(params.fee);
    //var form = Common.formValidate(params,requided);
    console.log('paaaaaaaaaraaaaaaaaaams');
    console.log(params);
    Reservation.create(params).exec(function(err,reservation){
      if(err) return res.json(false);
      return res.json(reservation);
    });
  },
  edit : function(req,res){
    Order.findOne( req.params.id ).populate('reservations').exec(function(err,order){
      Reservation.find({ 'order' : req.params.id })
        .populate('hotel').populate('airport').populate('client').exec(function(err,reservations){
        Client_.find().sort('name').exec(function(e,clients_){ 
          Transfer.find().sort('name').exec(function(e,transfers){ Hotel.find().sort('name').populate('location').exec(function(e,hotels){
            order.reservations = reservations || [];
            console.log(order);
            Common.view(res.view,{
              order : order, 
              clients_ : clients_ ,
              hotels : hotels , 
              transfers : transfers ,
              page:{
                name:'Reservación'
                ,icon:'fa fa-car'
                ,controller : 'order.js'
              },
              breadcrumb : [
                { label : 'Reservas' , url : '/order/' } , 
                { label : order.id }
              ]
            },req);
          }); }); // transfer / hotel 
        }); // client
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