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
  /*Esta será la función que obtenga las ordenes*/
  customFind : function(req,res){
    var params = req.params.all();
    var skip = params.skip || 0;
    var limit = params.limit || 20;
    //var fields = params.fields || {};
    var fields = formatFilterFields(params.fields);
    if( ! req.user.isAdmin ){
      var c_ = [];
      for(c in req.user.companies ){
        if( req.user.companies[c].id )
          c_.push( sails.models['company'].mongo.objectId(req.user.companies[c].id) );
      }
      //console.log('companies');console.log(c_);
      fields.company = { "$in" : c_ };
    }
    Reservation.native(function(e,reservation){
      reservation.aggregate([ { $sort : { createdAt : -1 } },{ $match : fields },{ $group : { _id : "$order" } },{ $skip : skip } , { $limit : limit }
      ],function(err,reservations){
        var ids = [];
        for(x in reservations) ids.push( reservations[x]._id );
        //console.log('----------IDS---------');console.log(fields);console.log(ids);
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
    //console.log('select_company');console.log(select_company);
  	Client_.find({company:select_company}).sort('name').exec(function(e,clients_){ Hotel.find().sort('name').populate('location').populate('zone').populate('rooms').exec(function(e,hotels){ Tour.find().sort('name').exec(function(e,allTours){
  			Common.view(res.view,{
  				clients_ : clients_ ,
  				hotels:[] ,
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
    //console.log(req.user);
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
    params.company = params.company?params.company:(req.session.select_company || req.user.select_company);
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
    delete params.id;
    Order.findOne(params.order).exec(function(e,theorder){
      if(e) return res.json(e);
      params.company = theorder.company?theorder.company:(req.session.select_company || req.user.select_company);
      Reservation.create(params).exec(function(err,reservation){
        if(err) return res.json(err);
        theorder.reservations.push(reservation.id);
        //console.log('reservations');console.log(theorder);
        theorder.save(function(err_o){
          //console.log('reservations');console.log(theorder);
          return res.json(reservation);
        });
      });
    });
  },
  createReservationTour : function(req,res){
    var params = req.params.all();
    Order.findOne({id : params.order.id }).exec(function(e,theorder){
      if(e) return res.json(e);
      async.mapSeries( params.items, function(item,cb) {
        item.order = params.order.id;
        item.company = theorder.company?theorder.company:(req.session.select_company || req.user.select_company);
        item.user = req.user.id;
        delete item.id;
        Reservation.create(item).exec(function(err,r){
          item.id = r.id; 
          //theorder.reservations.push(r.id);
          cb(err,item);
        });
      },function(err,results){
          if (err) {
              console.log(err);
              return res.json(err);
          }
          return res.json(results);
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
      Reservation.find({ order : req.params.id }).populate('hotel').populate('tour').populate('airport').populate('client').exec(function(err,reservations){
              //console.log(reservations[0]);
        Client_.find().sort('name').exec(function(e,clients_){ 
          Client_.findOne({ id : order.client}).populate('contacts').exec(function(e,theclient){
              //console.log(theclient);
              Transfer.find().sort('name').exec(function(e,transfers){
                  Hotel.find().sort('name').populate('location').populate('rooms').exec(function(e,hotels){
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
      var company = params.company?params.company:(req.session.select_company || req.user.select_company);
      TransferPrice.find({ 
        company : company,
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
    var thecompany = req.user.default_company;
    var theuser = req.user.id;
    req.file('file').upload({saveAs:dateString + '.csv',dirname:dirSave,maxBytes:52428800},function(e,files){
        if(e) res.json({text : 'error'});
        if (files && files[0]){
            var fileImported = { fileName : files[0].filename, dtStart : dateValue, status : 'processing' };
            var lineList = fs.readFileSync(dirSave + dateString +".csv").toString().split('\n');
            lineList.shift();
            //var schemaKeyList = ["hotel","airport","fee","transfer","autorization_code","state","payment_method","pax","origin","type","arrival_date","arrival_fly","arrival_time","arrivalpickup_time","client","departure_date","departure_fly","departure_time","departurepickup_time"];
            //var schemaKeyList = ["referencia","Client","Email","Phone","Pax","Precio Web Total","Total","Moneda","Descuento (%)","Cupon","Agencia","Precio Agencia","Moneda","Agencia diferencia","Usuario","Flight Number(arrival)","Arrival Date","Arrival time","Hotel","Region","Flight Number(departure)","Pickup Date Departure","Pickup Time Departure","Departure Date","Departure Time","Amount of Services","Service type","Metodo de pago","Airport","Service Type","Reservation Date","Status","CuponID","Cupon Token","Cupon Nombre","Usuario de instancia","Tour"];
            var schemaKeyList = ['service','client','pax','arrival_date','arrival_fly','arrival_time','Hotel','transfer','departure_date','departure_fly','departure_time','note','agency','Airport'];
            async.mapSeries(lineList,function(line,callback) {
                var reservation = {};
                //set keys for items in reservations
                line.split(',').forEach(function (entry, i) { reservation[schemaKeyList[i]] = entry; });
                var reads = [
                    function(cbt){ Hotel.findOne({ name : reservation['Hotel'].replace(/(")/g, "") }).exec(function(err,hotels){ cbt(err,hotels) })
                    },function(hotels,cbt){ Airport.findOne({ name : reservation['Airport'].replace(/(")/g, "") }).exec(function(err,airports){ cbt(err,hotels,airports) })
                    },function(hotels,airports,cbt){ Transfer.findOne({ name : reservation['transfer'].replace(/(")/g, "") }).exec(function(err,transfers){ cbt(err,hotels,airports,transfers) }) }
                ];
                var index = 0;
                async.waterfall(reads,function(e,hotels,airports,transfers){
                    console.log(' ----------------------: ' + reservation['referencia']);
                    if(e) throw(e);
                    var ash = []; //array de campos que han causado error
                    if(typeof hotels != 'undefined' && hotels.id ) reservation['Hotel'] = hotels.id;
                    else ash.push('Hotel');
                    if(typeof airports != 'undefined' && airports.id ) reservation['Airport'] = airports.id;
                    else ash.push('Airport');
                    if(typeof transfers != 'undefined' && transfers.id ) reservation['transfer'] = transfers.id;
                    else ash.push('Transfer');
                    if(ash.length>0) errors.push({r:reservation,index:index,err:ash});
                    //callback reservación formateada
                    callback(null,formatReservation(reservation));
                    index++;
                });//async waterfall END
            }, function(err,result) { //async cb
                var success = false;
                if(err){ console.log('err: ');console.log(err); }
                if( errors.length == 0 ){
                  success = true;
                  //create reservations
                  async.mapSeries(result,function(r,callback){
                    TransferPrice.calculatePrice(r.reservation.hotel, r.reservation.airport, r.reservation.transfer, r.reservation.type, r.reservation.pax, thecompany, function(theprice){
                      Client_.create(r.client).exec(function(o_err,client){
                        var o = { user:req.user.id, company:thecompany, reservation_method:'import', reservations:[], client : client.id };
                        Order.create(o).exec(function(o_err,order){
                          r.reservation.order = order.id;
                          r.reservation.user = theuser;
                          r.reservation.company = thecompany;
                          Reservation.create(r.reservation).exec(function(r_err,reservation){
                            callback(r_err,reservation);
                          });//reservation create END
                        });//order create END
                      });//client create END
                    });//get price END
                  },function(err_,result_) {
                    res.json({success : success, result : result , errors : errors });
                  });//async create reservations
                }else{
                  success = false;
                  res.json({success : success, result : result , errors : errors });
                }
                //res.json({success : success, result : result , errors : errors });
            }); //async end
        }else{
          res.json({success : false , result : [] , errors : [] });
        }
    });
  }
};
/*
  'service','client','pax','arrival_date','arrival_fly','arrival_time','Hotel','transfer',
  'departure_date','departure_fly','departure_time','note','agency','Airport';

Esta función formatea los campos que vienen del cvs para: 
  - Pasar un objeto al create
  - Calcular el precio
  - Agregar los campos que hacen falta (ya que no mandan todo lo que guardamos)
*/
function formatReservation(r){
  var result = { reservation : {} , client : {} };
  //Reservation fields
  result.reservation.pax = r['pax'];
  result.reservation.company = r['agency'];
  result.reservation.hotel = r['Hotel'];
  result.reservation.transfer = r['transfer'];
  result.reservation.airport = r['Airport'];
  result.reservation.notes = r['note'];
  if(r['service'].toLowerCase()=='llegada'){
    result.reservation.origin = 'airport';
    result.reservation.arrival_fly = r['arrival_fly'];
    result.reservation.arrival_date = new Date(r['arrival_date']);
    result.reservation.arrival_time = new Date(r['arrival_date'] + ' ' + r['arrival_time']);
  }else{
    result.reservation.origin = 'hotel';
    result.reservation.departure_fly = r['departure_fly'];
    result.reservation.departure_date = new Date(r['departure_date']);
    result.reservation.departure_time = new Date(r['departure_date'] + ' ' + r['departure_time']);
    result.reservation.departurepickup_time = result.reservation.departure_time;
  }
  //control attributes fixed
  result.reservation.reservation_type = 'transfer';
  result.reservation.type = 'one_way';
  result.reservation.state = 'pending';
  result.reservation.payment_method = 'i don´t care';
  //hay que calcular este monto
  result.reservation.fee = '0.0';
  //Client fields
  result.client.name = r['Client'];
  //result.client.phone = r['Phone'];
  //result.client.email = r['Email'];
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
    if( f[x].model ){
      if( f[x].type == 'date' ){
        var from = {}; from[f[x].field] = { '$gte' : new Date(f[x].model.from) };
        var to = {}; to[f[x].field] = { '$lte' : new Date(f[x].model.to) };
        fx['$and'] = [from,to];
        //console.log('from');console.log(from);console.log('to');console.log(to);
      }else if( f[x].type == 'autocomplete' ){
        if(sails.models[f[x].model_]) 
          fx[ f[x].field ] = sails.models[f[x].model_].mongo.objectId(f[x].model.item.id);
        else
          fx[ f[x].field ] = f[x].model.item.id;
      }else if( f[x].type == 'select' ){
        fx[ f[x].field ] = f[x].model.item;
      }
    }
  }
  return fx;
}