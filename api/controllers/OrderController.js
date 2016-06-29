/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var fs = require('fs');
var phantom = require('phantom');
//Promise = require('es6-promise').Promise;
module.exports = {
  /*
    VISTAS
  */
  index: function (req, res) {
  	Common.view(res.view,{
      cancelationMotives : OrderCore.getCancelationMotives()
  		,page:{ name:req.__('sc_reservations'), icon:'fa fa-car', controller : 'order.js' }
  		,breadcrumb : [ {label : req.__('sc_reservations')} ]
  	},req);
  },
  neworder : function(req,res){
    var select_company = req.session.select_company || req.user.select_company;
        Common.view(res.view,{
          page:{ name:req.__('sc_reservations'), icon:'fa fa-car', controller : 'order.js' },
          breadcrumb : [ {label : req.__('sc_reservations')} ]
        },req);
  },
  quickorder : function(req,res){
    var select_company = req.session.select_company || req.user.select_company;
    Common.view(res.view,{
      page:{ name:req.__('sc_reservations'), icon:'fa fa-car', controller : 'order.js' },
      breadcrumb : [ {label : req.__('sc_reservations')} ]
    },req);
  },
  quicktour : function(req,res){
    var select_company = req.session.select_company || req.user.select_company;
    Common.view(res.view,{
      page:{ name:req.__('sc_reservations'), icon:'fa fa-compass', controller : 'order.js' },
      breadcrumb : [ {label : req.__('sc_reservations')} ]
    },req);
  },
  edit : function(req,res){
    //console.log( req.params.all() );
    Order.findOne( req.params.id ).populate('reservations').populate('claims').populate('lostandfounds').populate('currency').exec(function(err,order){ 
      Reservation.find({ order : req.params.id })
      .populate('hotel').populate('tour').populate('airport').populate('client')
      .populate('currency').populate('transfer').populate('transferprice')
      .exec(function(err,reservations){ Company.findOne(order.company).populate('currencies').populate('base_currency').exec(function(c_err,ordercompany){
        Client_.find().sort('name').exec(function(e,clients_){ 
          Client_.findOne({ id : order.client}).populate('contacts').exec(function(e,theclient){
              Transfer.find().sort('name').exec(function(e,transfers){
                  Hotel.find().limit(1).sort('name').populate('location').populate('rooms').exec(function(e,hotels){
                    //console.log('order', order);
                    order.reservations = reservations || [];
                    Common.view(res.view,{
                      order : order,
                      clients_ : clients_ ,
                      theclient : theclient ,
                      hotels : hotels ,
                      transfers : transfers ,
                      ordercompany : ordercompany ,
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
    }); }); //order and company
  },
  /*
    LLAMADAS HTTP
  */
  validatecupon : function(req,res){
    var params = req.params.all();
    OrderCore.validateCupon(params.token,function(err,cupon,single){
      res.json({ err : err, cupon : cupon, single : single })
    });
  },
  updateOrderDate : function(req,res){
    var company = req.user.select_company || req.session.select_company
    if(req.user.hasPermission(company.id,'orders_e')){
      var params = req.params.all();
      OrderCore.updateOrderDate(params,function(err,result){
        res.json({ error : err, result : result });
      });
    }else{
      res.json({ error : 'No existen permisos suficientes', result : false });
    }
  },
  cancelorder : function(req,res){
    var params = req.params.all();
    OrderCore.cancelOrder(params.id,params.cancelation,function(err,result){
      res.json({ error : err, result : result });
    });
  },
  reporteespecial : function(req,res){
    var fields = {};
    Reports.getReport('logisticsReport',fields,function(results,err){
      Export.mkp_report(results,function(err,csv){
        var name = 'Reporte de montos ' + '.csv';
        res.attachment(name);
        res.end(csv, 'UTF-8');
      });
    });
  },
  reportcustom : function(req,res,next){
    res.header('Content-disposition', 'attachment; filename=file.pdf');
    res.header('Content-type', 'application/pdf');
    res.download('/uploads/file.pdf');
    res.end();
    /*var expectedContent = '<html><body><div>Test div</div></body></html>';
    phantom.create().then(function(ph) {
      console.log('create');
        ph.createPage().then(function(page) {
          console.log('create page');
          page.open('http://google.com').then(function(){
          //page.setting('content',expectedContent).then(function(){
            console.log('OPEN');
          });
          page.property('onLoadFinished').then(function() {  
          //page.setting('content',expectedContent).then(function(){
            console.log('LOAD');
            var file = __dirname+'/../../assets/uploads/file.pdf';
            var filemin = '/uploads/file.pdf';
            page.render(file,{format:'pdf'}).then(function(x){
            //page.property('content').then(function(content) {
                ph.exit();
                console.log('render',x);
                res.header('Content-disposition', 'attachment; filename=file.pdf');
                res.header('Content-type', 'application/pdf');
                res.download(filemin);
                res.end();
              //});
            });
          });//on load
        });
    });*/
  },
  reportcustom_ : function(req,res){
    var params = req.params.all();
    if( params.type ){
      //console.log('COOKIES',JSON.parse(req.cookies.filters));
      //var fields = formatFilterFields(params.fields);
      if(req.cookies.filters && req.cookies.filters != '')
        var fields = formatFilterFields(JSON.parse(req.cookies.filters));
      else
        var fields = {};
      if( ! req.user.isAdmin ){
        var c_ = [];
        for(c in req.user.companies ){
          if( req.user.companies[c].id )
            c_.push( sails.models['company'].mongo.objectId(req.user.companies[c].id) );
        }
        //console.log('companies');console.log(c_);
        fields.company = { "$in" : c_ };
      }
      console.log('FIELDS 0:',fields)
      Reports.getReport(params.type,fields,function(results,err){
          res.json({ results : results , err : err });
      });
    }
  },
  /*Esta será la función que obtenga las ordenes*/
  customFind : function(req,res){
    var params = req.params.all();
    var skip = params.skip || 0;
    var limit = params.limit || 20;
    var fields = formatFilterFields(params.fields);
    if( ! req.user.isAdmin ){
      var c_ = [];
      for(c in req.user.companies ){
        if( req.user.companies[c].id )
          c_.push( sails.models['company'].mongo.objectId(req.user.companies[c].id) );
      }
      fields.company = { "$in" : c_ };
    }
      Reservation.native(function(e,reservation){
        //{ $group : { _id : { id : '$_id',createdAt : '$createdAt',order:'$order'  },createdAt : { $push : '$createdAt' } } },{ $sort : { '_id.createdAt' : -1 } },
        reservation.aggregate([{ $match : fields },{$sort:{ createdAt : -1 }},{ $skip : skip } , { $limit : limit },{ $group : { _id : "$order" } } //,{ $skip : skip } , { $limit : limit }
        ],function(err,reservations){
          //console.log('reservations err',err);
          //console.log('reservations',reservations);
          var ids = [];
          for(x in reservations){ ids.push( reservations[x]._id ); }
            reservation.aggregate([
                { $match : fields }, { $sort : { createdAt : -1 } }, { $group : { _id : "$order" } }, { $group : { _id : null , count : { $sum:1 } } }
            ],function(err_c,count_){
              if(err_c) res.json({ result:[],orders:[],count: 0 });
              customOrdersFormat(ids,function(results){
                res.json({ result:[],orders:results,count: (count_&&count_.length>0?count_[0].count:0) });
              });
            });
        });
      });
  },
  getorder : function(req,res){
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
      var form = Common.formValidate(req.params.all(),['name','address','phone','email']);
      if(form){
          form.user = req.user.id;
          if(!form.company)
            form.company = req.user.select_company || req.session.select_company;
          Client_.create(form).exec(function(err,client_){
              if(err) return res.json(false);
              return res.json(client_);
          });
      }
  },
  updateClient: function(req,res){
        var form = Common.formValidate(req.params.all(),['id','name','phone','email']);
        if(form){
            Client_.update({id:form.id},form).exec(function(err,client_){
                if(err) return res.json({client:false ,text:'Ocurrio un error.'});
                res.json({client: client_ ,text:'Cliente actualizado.'});
            });
        }
    },
  createOrder : function(req,res){
    var params = req.params.all();
    OrderCore.createOrder(params,req,function(err,order){
      if(err) return res.json(err);
      return res.json(order);
    });
  },
  createReservation : function(req,res){
    var params = req.params.all();
    //ya debe de existir la orden
    OrderCore.createTransferReservation(params, req.user.id, req.session.select_company || req.user.select_company ,function(err,reservation){
      return res.json(reservation);
    });
  },
  /*
    Esta función va a manejar las reservas rápidas
    En el caso de los tours se debe crear la orden, el cliente y el tour
    En el caso del transfer se recibirá sólo la reserva (ya debe de existir la orden y el cliente)
  */
  createquickreservation : function(req,res){
    var params = req.params.all();
    delete params.id;
    var aux = {};
    aux.items = [];
    aux.generalFields = params.generalFields;
    if( params.currency )
      aux.currency = params.currency;
    if( params.reservation_type == 'tour' ){
      Client_.create({ name : params.client }).exec(function(err,client){
        if(err) return res.json({ error : err, result : false });
        orderParams = { client : client.id , company : params.company, token : params.token };//cliente y agencia
        aux.client = client;
        OrderCore.createOrder( orderParams, req, function(err,order){
          if(err) return res.json({ error : err, result : false });
          aux.order = order.id;
          aux.items.push(params);
          delete params.token;
          OrderCore.createReservationTourHotel(aux,req.user.id,function(err,results){
            if(err) return res.json({ error : err, result : false });
            return res.json({ error : false, results : results });
          });
        });
      });
    }
  },
  createReservationTour : function(req,res){
    var params = req.params.all();
    OrderCore.createReservationTourHotel(params,req.user.id,function(err,results){
      if (err) return res.json(err);
      return res.json(results);
    });
  },
  updateReservation : function(req,res){
    var params = req.params.all();
    if( !params.state || !params.payment_method || !params.currency ) 
      return res.json('no all params');
    var orderParams = { state : params.state, payment_method : params.payment_method, currency : params.currency };
    OrderCore.updateOrderParams(params.order,orderParams,function(err,order){
      if(err) return res.json(err);
      OrderCore.updateReservations(params,function(err,results){
        if(err) return res.json(err);
        return res.json(results);
      });
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
      OrderCore.getAvailableTransfers(params.zone1,params.zone2,company,function(err,prices){
        if(err) res.json(false);
        res.json(prices);
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
    Order.find(o).populate('client',c).populate('reservations',r).populate('company').then(function(orders) {
      var result = [];
      for(var x in orders){
        if(orders[x].reservations.length>0 && typeof orders[x].client != 'undefined' ) result.push(orders[x]);
      }
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
        if( f[x].field == 'arrival_date' ){
          fx['$or'] = [ 
            { $and : [ from, to ] }, 
            { $and : [ { startDate : { '$gte' : new Date(f[x].model.from) } }, { startDate : { '$lte' : new Date(f[x].model.to) } } ] }, 
            { $and : [ { cancelationDate : { '$gte' : new Date(f[x].model.from) } }, { cancelationDate : { '$lte' : new Date(f[x].model.to) } } ] }
            ]
        }else{
          fx['$and'] = [from,to];
        }
      }else if( f[x].type == 'autocomplete' ){
        if(sails.models[f[x].model_]){
          if( f[x].special_field && f[x].special_field == 'provider' ){
            var newitem = [];
            for(var sp in f[x].model.item )
              newitem.push( sails.models[f[x].model_].mongo.objectId( f[x].model.item[sp] ) );
            fx[ f[x].field ] = { '$in' : newitem};
          }else
            fx[ f[x].field ] = sails.models[f[x].model_].mongo.objectId(f[x].model.item.id);
        }else
          fx[ f[x].field ] = f[x].model.item.id;
      }else if( f[x].type == 'select' || f[x].type == 'text' || f[x].type == 'number' ){
        if( f[x].model_ && sails.models[f[x].model_] ){
            fx[ f[x].field ] = sails.models[f[x].model_].mongo.objectId(f[x].model.item);
        }else
          fx[ f[x].field ] = f[x].type=='number'?parseInt(f[x].model.item):f[x].model.item;
      }
    }
  }
  return fx;
}
//En este caso necesito obtener los tours, hoteles, aeropuertos, transfers
var customOrdersFormat = function(ids,callback){
  var reads = [
    function(cb){
      Order.find().where({ id : ids }).sort({'createdAt':-1}).populate('client').populate('reservations').populate('user').populate('company').exec(cb)
    },function(orders,cb){
      var tours = [], hotels = [], transfers = [], airports = [];
      for( var x in orders ){
        for( var y in orders[x].reservations ){
          if( orders[x].reservations[y].tour && !tours[orders[x].reservations[y].tour] ) tours.push(orders[x].reservations[y].tour);
          if( orders[x].reservations[y].hotel && !hotels[orders[x].reservations[y].hotel] ) hotels.push(orders[x].reservations[y].hotel);
          if( orders[x].reservations[y].transfer && !transfers[orders[x].reservations[y].transfer] ) transfers.push(orders[x].reservations[y].transfer);
          if( orders[x].reservations[y].airport && !airports[orders[x].reservations[y].airport] ) airports.push(orders[x].reservations[y].airport);
        }
      }
      Tour.find({id : tours}).exec(function(t_e,r_tours){
        Hotel.find({id : hotels}).populate('rooms').exec(function(h_e,r_hotels){
          Airport.find({id : airports}).exec(function(a_e,r_airports){
            Transfer.find({id : transfers}).exec(function(tr_e,r_transfers){
              //cb(null,{ tours : r_tours , hotels : r_hotels , airports : r_airports , transfers : r_transfers });
              cb(null,orders,{ tours : r_tours , hotels : r_hotels , airports : r_airports , transfers : r_transfers })
            });
          });
        });
      });
    },function(orders,items_reservations,cb){
      var tours = _.indexBy(items_reservations.tours, 'id');
      var hotels = _.indexBy(items_reservations.hotels, 'id');
      var transfers = _.indexBy(items_reservations.transfers, 'id');
      var airports = _.indexBy(items_reservations.airports, 'id');
      for(var x in orders){
        _.map(orders[x].reservations,function(val,key){
          if( val.tour ) val.tour = tours[val.tour];
          if( val.hotel ) val.hotel = hotels[val.hotel];
          if( val.transfer ) val.transfer = transfers[val.transfer];
          if( val.airport ) val.airport = airports[val.airport];
        });
      }
      return cb(null, orders);
    }
  ]
  async.waterfall(reads,function(e,results){
    callback(results);
  });
}
