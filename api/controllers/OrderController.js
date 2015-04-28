/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var fs = require('fs');
module.exports = {
  index: function (req, res) {
  	Common.view(res.view,{
  		page:{
  			name:req.__('sc_reservations')
  			,icon:'fa fa-car'		
  			,controller : 'order.js'
  		},
  		breadcrumb : [
  			{label : req.__('sc_reservations')}
  		]
  	},req);
  },
  customFind : function(req,res){
    var params = req.params.all();
    var skip = params.skip || 0;
    var limit = params.limit || 10;
    //var fields = params.fields || {};
    var fields = formatFilterFields(params.fields);
    Reservation.native(function(e,reservation){
      reservation.aggregate([ { $sort : { createdAt : -1 } },{ $match : fields },{ $group : { _id : "$order" } },{ $skip : skip } , { $limit : limit }
      ],function(err,reservations){
        var ids = [];
        for(x in reservations) ids.push( reservations[x]._id );
        //console.log('----------IDS---------');console.log(ids);
        Order.find().where({ id : ids }).populate('client').populate('reservations').populate('user').populate('company')
          .exec(function(err,orders){
          //console.log('----------orders-------------');console.log(orders);
          reservation.aggregate([
              { $match : fields } , { $group : { _id : "$order" } } , { $group : { _id : null , count : { $sum:1 } } }
          ],function(err_c,count_){
            res.json({ result:[],orders:orders,count: (count_[0]?count_[0].count:0) });
          });
        });
      });
    });
  },
  neworder : function(req,res){
    var select_company = req.session.select_company || req.user.select_company;
  	Client_.find({company:select_company}).sort('name').exec(function(e,clients_){ Hotel.find().sort('name').populate('location').populate('zone').populate('rooms').exec(function(e,hotels){ Tour.find().sort('name').exec(function(e,allTours){
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
  getorderfor : function(req,res){
    Order.findOne({id:req.param('id')}).populate('reservations').populate('client').populate('company').exec(function(e,order){
      if(e) return res.json(false);
      res.json(order);
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
    params.reservation_method = 'intern';
    params.req = req;
    params.reservations = [];
    delete params.id;
    //console.log(params);
    Order.create(params).exec(function(err,order){
        //console.log(err);
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
    params.airport = params.airport.id;
  	params.client = params.client.id;
    params.user = req.user.id;
    params.company = req.session.select_company || req.user.select_company;
    delete params.id;
    //params.req = {};
    //params.req.user = req.user || false;
    //params.req.session = req.session || false;
    //params.req.options = req.options || false;
    //console.log(params);
		//var fee = calculateFee(params.fee);
    //var form = Common.formValidate(params,requided);
    Order.findOne(params.order).exec(function(e,theorder){
      if(e) return res.json(e);
      Reservation.create(params).exec(function(err,reservation){
        if(err) return res.json(err);
        theorder.reservations.push(reservation.id);
        console.log('reservations');
        console.log(theorder);
        theorder.save(function(err_o){
          console.log('reservations');
          console.log(theorder);
          return res.json(reservation);
        });
      });
    });
  },
  createReservationTour : function(req,res){
    var params = req.params.all();
    Order.findOne(params.order).exec(function(e,theorder){
      async.mapSeries( params.items, function(item,cb) {
        item.order = params.order;
        delete item.id;
        Reservation.create(item).exec(function(err,r){
          item.id = r.id; 
          //theorder.reservations.push(r.id);
          cb(err,item);
        });
      },function(err,results){
        theorder.save(function(err_o){
          return res.json(results);
        });
      });
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
    Order.findOne( req.params.id ).populate('reservations').populate('claims').populate('lostandfounds').exec(function(err,order){
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
        "$or":[ 
          { "$and" : [{'zone1' : params.zone1, 'zone2' : params.zone2}] } , 
          { "$and" : [{'zone1' : params.zone2, 'zone2' : params.zone1}] } 
        ] 
      }).populate('transfer').exec(function(err,prices){
        if(prices)
          return res.json(prices);
        else
          return res.json(false);
      });
    }else{
      return res.json(false);
    }
  },
  customsearch : function(req,res){
    var params = req.params.all();
    var o = params.createdAt?{ createdAt : params.createdAt }:{};
    var c = {};
    if(params.name)
      c.name = new RegExp(params.name,"i");
    if(params.last_name)
      c.last_name = new RegExp(params.last_name,"i");
    var r = {};
    if(params.reservation_type)
      r = {reservation_type : params.reservation_type};
    //console.log(params);console.log(c);console.log(o);console.log(r);
    Order.find(o).populate('client',c).populate('reservations',r).populate('company').then(function(orders) {
      var result = [];
      for(var x in orders){
        //console.log(orders[x].reservations.length);
        if(orders[x].reservations.length>0 && typeof orders[x].client != 'undefined' ) result.push(orders[x]);
      }
      //console.log(result);
      res.json(result);
    });
  }
  /*
    Función que recive un cvs para importar reservas
  */
  ,uploadcvs : function(req,res){
    var dirSave = __dirname+'/../../assets/uploads/cvs/';
    var dateValue = new Date();
    var dateString = 'cvstest';
    var errors = [];
    req.file('file').upload({saveAs:dateString + '.csv',dirname:dirSave,maxBytes:52428800},function(e,files){
        if(e) console.log(e);
        if(e) res.json({text : 'error'});
        if (files && files[0]) {
            var fileImported = {
                fileName : files[0].filename,
                dtStart : dateValue,
                status : 'processing'
            };
            var lineList = fs.readFileSync(dirSave + dateString +".csv").toString().split('\n');
            lineList.shift();
            //var schemaKeyList = ["hotel","airport","fee","transfer","autorization_code","state","payment_method","pax","origin","type","arrival_date","arrival_fly","arrival_time","arrivalpickup_time","client","departure_date","departure_fly","departure_time","departurepickup_time"];
            //var schemaKeyList = ["referencia","Client","Email","Phone","Pax","Precio Web Total","Total","Moneda","Descuento (%)","Cupon","Agencia","Precio Agencia","Moneda","Agencia diferencia","Usuario","Flight Number(arrival)","Arrival Date","Arrival time","Hotel","Region","Flight Number(departure)","Pickup Date Departure","Pickup Time Departure","Departure Date","Departure Time","Amount of Services","Service type","Metodo de pago","Airport","Service Type","Reservation Date","Status","CuponID","Cupon Token","Cupon Nombre","Usuario de instancia","Tour"];
            var schemaKeyList = ["origin","client","pax","arrival_date","arrival_fly",'arrival_time','hotel','transfer','departure_date','departure_fly','departure_time','note','agency'];
            async.mapSeries(lineList,function(line,callback) {
                var reservation = {};
                line.split(',').forEach(function (entry, i) {
                    reservation[schemaKeyList[i]] = entry;
                });
                var reads = [
                    function(cbt){
                        Hotel.findOne({ name : reservation['hotel'].replace(/(")/g, "") }).populate('location').exec(function(err,hotels){ cbt(err,hotels) })
                        //Hotel.findOne({ name : reservation['hotel'] }).exec(cb)
                    },function(hotels,cbt){
                        Location.findOne().populate('airports').exec(function(err,loc_){
                          airport 
                        });
                        Airport.findOne({ name : reservation['Airport'].replace(/(")/g, "") }).exec(function(err,airports){ cbt(err,hotels,airports) })
                        //Airport.findOne({ name : reservation['airport'] }).exec(function(e,airports){ cb(e,hotels,airports) })
                    },function(hotels,airports,cbt){
                        Transfer.findOne({ name : reservation['Service Type'].replace(/(")/g, "") }).exec(function(err,transfers){ cbt(err,hotels,airports,transfers) })
                        //Transfer.findOne({ name : reservation['transfer'] }).exec(function(e,transfers){ cb(e,hotels,airports,transfers) })
                    }
                ];
                async.waterfall(reads,function(e,hotels,airports,transfers){
                    console.log(' ----------------------: ' + reservation['referencia']);
                    //console.log(reservation);
                    if(e) throw(e);
                    var ash = [];
                    if(typeof hotels != 'undefined' && hotels.id ) reservation['Hotel'] = hotels.id;
                    else ash.push('Hotel');

                    if(typeof airports != 'undefined' && airports.id ) reservation['Airport'] = airports.id;
                    else ash.push('Airport');

                    if(typeof transfers != 'undefined' && transfers.id ) reservation['Service Type'] = transfers.id;
                    else ash.push('Transfer');

                    if(ash.length>0) errors.push({r:reservation,err:ash});

                    callback(null,formatReservation(reservation));
                });
            }, function(err,result) { //async cb
                var $r = 'finished'
                var success = false;
                if (err) {
                    console.log('err: ');
                    console.log(err);
                }
                if( errors.length == 0 ){
                  //create reservations
                  success = true;
                }else{
                  success = false;
                }
                //console.log('result');console.log(result);
                res.json({success : success, result : result , errors : errors });
            }); //async end
        }else{
          res.json({success : false , result : [] , errors : [] });
        }
    });
    //res.json({text : 'err',success : false});
  }
};
/*
  "referencia","Client","Email","Phone","Pax","Precio Web Total","Total","Moneda",
  "Descuento (%)","Cupon","Agencia","Precio Agencia","Moneda","Agencia diferencia",
  "Usuario","Flight Number(arrival)","Arrival Date","Arrival time","Hotel","Region",
  "Flight Number(departure)","Pickup Date Departure","Pickup Time Departure",
  "Departure Date","Departure Time","Amount of Services","Service type",
  "Metodo de pago","Airport","Service Type","Reservation Date","Status","CuponID",
  "Cupon Token","Cupon Nombre","Usuario de instancia","Tour"];

Por ahora voy a omitir moneda, cupón, usuario, region(no creo sea necesario)
*/
function formatReservation(r){
  var result = { reservation : {} , client : {} };
  //Reservation fields
  result.reservation.pax = r['Pax'];
  result.reservation.fee = r['Total'];
  //result.reservation.cupon = r['Cupon'];
  result.reservation.company = r['Agencia'];
  result.reservation.arrival_fly = r['Flight Number(arrival)'];
  result.reservation.arrival_date = r['Arrival Date'];
  result.reservation.arrival_time = r['Arrival time'];
  result.reservation.departure_fly = r['Flight Number(departure)'];
  result.reservation.departure_date = r['Departure Date'];
  result.reservation.departure_time = r['Departure Time'];
  result.reservation.departurepickup_time = r['Pickup Date Departure']; // unir con: Pickup Date Departure
  result.reservation.hotel = r['Hotel'];
  result.reservation.transfer = r['Service type'];
  result.reservation.payment_method = r['Metodo de pago'];
  result.reservation.airport = r['Airport'];
  result.reservation.type = r['Service Type'];
  result.reservation.state = r['Status'];
  //result.reservation. = r[''];result.reservation. = r[''];
  //Client fields
  result.client.name = r['Client'];
  result.client.phone = r['Phone'];
  result.client.email = r['Email'];
  return result
}
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
function formatFilterFields(f){
  var fx = {};
  for( var x in f ){
    if( f[x].model[f[x].field] ){
      if( f[x].type == 'date' ){
        var from = {}; from[f[x].field] = { '$gte' : new Date(f[x].model[f[x].field].from) };
        var to = {}; to[f[x].field] = { '$lte' : new Date(f[x].model[f[x].field].to) };
        fx['$and'] = [from,to];
        console.log('from');console.log(from);
        console.log('to');console.log(to);
      }else if( f[x].type == 'select' || f[x].type == 'autocomplete' ){
        fx[ f[x].field ] = f[x].model[f[x].field].item;
      }
    }
  }
  return fx;
}