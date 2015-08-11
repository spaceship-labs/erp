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
  reportcustom : function(req,res){
    var params = req.params.all();
    if( params.type ){
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
    //console.log(fields);
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
  	//Client_.find({company:select_company}).sort('name').exec(function(e,clients_){ Hotel.find().sort('name').populate('location').populate('zone').populate('rooms').exec(function(e,hotels){ Tour.find().sort('name').exec(function(e,allTours){
  			Common.view(res.view,{
  				clients_ : [] ,
  				hotels:[] ,
  				transfers : [] ,
          allTours : [] ,
  				page:{
  					name:req.__('sc_reservations')
  					,icon:'fa fa-car'		
  					,controller : 'order.js'
  				},
  				breadcrumb : [
  					{label : req.__('sc_reservations')}
  				]
  			},req);
    //}); }); });
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
    params.user = req.user.id;
    params.company = params.company?params.company:(req.session.select_company || req.user.select_company);
    params.reservation_method = 'intern';
    params.req = req;
    params.reservations = [];
    delete params.id;
    //console.log(params);
    Order.create(params).exec(function(err,order){
        //console.log(err);
        if(err) return res.json(err);
        return res.json(order);
    });
  },
  createReservation : function(req,res){
    var params = req.params.all();
    params.hotel = params.hotel.id;
    params.state = params.state.handle;
    params.payment_method = params.payment_method ? params.payment_method.handle : 'creditcard';
    params.airport = params.airport.id;
    params.client = params.client.id;
    params.user = req.user.id;
    params.currency = params.currency.id;
    delete params.id;
    Order.findOne(params.order).populate('company').exec(function(e,theorder){
      if(e) return res.json(e);
      params.company = theorder.company?theorder.company:(req.session.select_company || req.user.select_company);
      Company.findOne({adminCompany:true}).exec(function(c_err,mainCompany){
        if(c_err) res.json(false);
        TransferPrice.findOne(params.transferprice).populate('transfer').exec(function(tp_err,transferprice){
          if(tp_err) res.json(false);
          //console.log('Fee: ' + params.fee);
          params.fee = transferprice[params.type] * Math.ceil( params.pax / transferprice.transfer.max_pax );
          if( params.currency != theorder.company.base_currency )
            params.fee *= theorder.company.exchange_rates[params.currency].sales;
          //console.log('Fee2: ' + params.fee);console.log(transferprice);
          params.fee_adults = transferprice.one_way;
          params.fee_adults_rt = transferprice.round_trip;
          params.fee_kids = transferprice.one_way_child;
          params.fee_kids_rt = transferprice.round_trip_child;
          params.commission_sales = transferprice.commission_user || 0;
          params.commission_agency = transferprice.commission_agency || 0;
          params.exchange_rate_sale = mainCompany.exchange_rate_sale;
          params.exchange_rate_book = mainCompany.exchange_rate_book;
          params.exchange_rates = mainCompany.exchange_rates;
          params.folio = theorder.folio;
          //console.log(params);
          Reservation.create(params).exec(function(err,reservation){
            console.log(err);
            if(err) return res.json(err);
            theorder.reservations.push(reservation.id);
            theorder.save(function(err_o){
              //console.log('reservations');console.log(theorder);
              return res.json(reservation);
            });
          });
        });
      });
    });
  },
  createReservation2 : function(req,res){
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
      //CompanyProduct.findOne({ product_type : 'transfer' , agency : params.company , transfer : params.transfer }).populate('transfer').exec(function(cp_err,product){
        Reservation.create(params).exec(function(err,reservation){
          if(err) return res.json(err);
          //antes de guardar la orden, hay que generar el objeto que guardará las comisiones
          theorder.reservations.push(reservation.id);
          //console.log('reservations');console.log(theorder);
          theorder.save(function(err_o){
            //console.log('reservations');console.log(theorder);
            return res.json(reservation);
          });
        });
      //});
    });
  },
  createReservationTour : function(req,res){
    var params = req.params.all();
    Order.findOne({id : params.order }).populate('company').exec(function(e,theorder){
      if(e) return res.json(e);
      //console.log(params.items);return res.json(false);
      async.mapSeries( params.items, function(item,cb) {
        item.order = theorder.id;
        item.company = theorder.company.id;
        item.user = req.user.id;
        item.payment_method = item.payment_method?item.payment_method.handle:params.generalFields.payment_method.handle;
        item.currency = item.currency?item.currency.id:params.generalFields.currency.id;
        item.autorization_code = item.autorization_code || params.generalFields.autorization_code;
        delete item.id;
        if( item.reservation_type == 'tour' ){
          if( theorder.company.adminCompany ){
            //en este caso llega un tour sólo es agregar los campos faltantes
            Tour.findOne(item.tour.id).populate('provider').exec(function(t_err,tour){
              if(t_err) cb(t_err,item);
              item.fee_adults = tour.fee;
              item.fee_adults_base = tour.fee_base;
              item.fee_kids = tour.feeChild;
              item.fee_kids_base = tour.feeChild_base;
              item.commission_agency = tour.commission_agency;
              item.commission_sales = tour.commission_sales;
              item.exchange_rate_sale = theorder.company.exchange_rate_sale;
              item.exchange_rate_book = theorder.company.exchange_rate_book;
              item.exchange_rate_provider = tour.provider.exchange_rate;
              item.exchange_rates = theorder.company.exchange_rates;
              item.tour = item.tour.id;
              item.folio = theorder.folio;
              //console.log(item);
              Reservation.create(item).exec(function(err,r){
                if(err) cb(err,item);
                //console.log(err);console.log(r);
                item.id = r.id; 
                cb(err,item);
              });
            });
          }else{
            //en este caso llega un companyProduct agregar los campos faltantes y cambiar el tour
            CompanyProduct.findOne(item.tour.id).exec(function(cp_err,companyproduct){
              Tour.findOne(companyproduct.tour).populate('provider').exec(function(t_err,tour){
                if(t_err) cb(t_err,item);
                item.fee_adults = tour.fee;
                item.fee_adults_base = tour.fee_base;
                item.fee_kids = tour.feeChild;
                item.fee_kids_base = tour.feeChild_base;
                item.commission_agency = tour.commission_agency;
                item.commission_sales = tour.commission_sales;
                item.exchange_rate_sale = theorder.company.exchange_rate_sale;
                item.exchange_rate_book = theorder.company.exchange_rate_book;
                item.exchange_rate_provider = tour.provider.exchange_rate;
                item.tour = tour.id;
                Reservation.create(item).exec(function(err,r){
                  item.id = r.id; 
                  cb(err,item);
                });
              });
            });
          }
        }else{
          Reservation.create(item).exec(function(err,r){
            item.id = r.id; 
            cb(err,item);
          });
        }
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
      delete item.flag_priceupdated;
      delete item.usePrice;
      delete item.useER;
      Reservation.update({id:id},item,function(err,r){
        cb(err,r);
      });
    },function(err,results){
      return res.json(results);
    });
  },
  edit : function(req,res){
    Order.findOne( req.params.id ).populate('reservations').populate('claims').populate('lostandfounds').exec(function(err,order){ Company.findOne(order.company).populate('currencies').populate('base_currency').exec(function(c_err,ordercompany){
      Reservation.find({ order : req.params.id })
      .populate('hotel').populate('tour').populate('airport').populate('client')
      .populate('currency').populate('transfer').populate('transferprice')
      .exec(function(err,reservations){
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
  * Obitien los transfers disponibles dependiendo de si está activo el precio
  * Recibe las 2 zonas para la búsqueda
  */
  getAvailableTransfers : function(req,res){
    var params = req.params.all();
    if( params.zone1 && params.zone2 ){
      var company = params.company?params.company:(req.session.select_company || req.user.select_company);
      customGetAvailableTransfers(company,params,res);
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
      }else if( f[x].type == 'select' || f[x].type == 'text' || f[x].type == 'number' ){
        if( f[x].model_ && sails.models[f[x].model_] )
          fx[ f[x].field ] = sails.models[f[x].model_].mongo.objectId(f[x].model.item)
        else
          fx[ f[x].field ] = f[x].type=='number'?parseInt(f[x].model.item):f[x].model.item;
      }
    }
  }
  return fx;
}