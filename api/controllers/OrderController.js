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
    //Order.find(params).sort('createdAt desc').populate('client').populate('reservations').populate('user').populate('company').exec(function(e,orders){
    Order.find().where(Common.getCompaniesForSearch(req.user)).sort('createdAt desc')
        .populate('client').populate('reservations').populate('user').populate('company')
    .limit(10).exec(function(e,orders){
      Order.count().where(Common.getCompaniesForSearch(req.user)).exec(function(e,totalOrders){
  		Common.view(res.view,{
  			orders : formatOrders(orders),
        totalOrders : totalOrders,
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
  	});
  },
  customFind : function(req,res){
    var params = req.params.all();
    var skip = params.skip || 0;
    var limit = params.limit || 10;
    var fields = params.fields || {};
    console.log(fields);
    Order.find().where().skip(skip).limit(limit).sort('createdAt desc')
    .populate('client').populate('reservations',fields).populate('user').populate('company')
    .exec(function(err,orders){
      if(err) res.json(false);
      var result = [];
      for(var x in orders){
        if( orders[x].reservations.length>0 ) result.push(orders[x]);
      }
      res.json({result:result,orders:orders});
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
    delete params.id;
    console.log(params);
    Order.create(params).exec(function(err,order){
        console.log(err);
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
    delete params.id;
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
      delete item.id;
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
    console.log(dirSave);
    req.file('file').upload({saveAs:dateString + '.csv',dirname:dirSave,maxBytes:52428800},function(e,files){
        if(e) console.log(e);
        if(e) res.json({text : 'error'});
        console.log(files);
        if (files && files[0]) {
            var fileImported = {
                fileName : files[0].filename,
                dtStart : dateValue,
                status : 'processing'
            };
            var lineList = fs.readFileSync(dirSave + dateString +".csv").toString().split('\n');
            lineList.shift();
            //var schemaKeyList = ["hotel","airport","fee","transfer","autorization_code","state","payment_method","pax","origin","type","arrival_date","arrival_fly","arrival_time","arrivalpickup_time","client","departure_date","departure_fly","departure_time","departurepickup_time"];
            var schemaKeyList = ["referencia","Client","Email","Phone","Pax","Precio Web Total","Total","Moneda","Descuento (%)","Cupon","Agencia","Precio Agencia","Moneda","Agencia diferencia","Usuario","Flight Number(arrival)","Arrival Date","Arrival time","Hotel","Region","Flight Number(departure)","Pickup Date Departure","Pickup Time Departure","Departure Date","Departure Time","Amount of Services","Service type","Metodo de pago","Airport","Service Type","Reservation Date","Status","CuponID","Cupon Token","Cupon Nombre","Usuario de instancia","Tour"];
            async.mapSeries(lineList,function(line,callback) {
                var reservation = {};
                line.split(',').forEach(function (entry, i) {
                    reservation[schemaKeyList[i]] = entry;
                });
                var reads = [
                    function(cb){
                        //Hotel.findOne({ name : reservation['hotel'] }).exec(cb)
                        Hotel.findOne({ name : reservation['Hotel'] }).exec(cb)
                    },function(hotels,cb){
                        //Airport.findOne({ name : reservation['airport'] }).exec(function(e,airports){ cb(e,hotels,airports) })
                        Airport.findOne({ name : reservation['Airport'] }).exec(function(e,airports){ cb(e,hotels,airports) })
                    },function(hotels,airports,cb){
                        //Transfer.findOne({ name : reservation['transfer'] }).exec(function(e,transfers){ cb(e,hotels,airports,transfers) })
                        Transfer.findOne({ name : reservation['Service Type'] }).exec(function(e,transfers){ cb(e,hotels,airports,transfers) })
                    }
                ];
                async.waterfall(reads,function(e,hotels,airports,transfers){
                    console.log(' --------------------------------------- ');
                    console.log(reservation);
                    if(e) throw(e);
                    if( hotels && hotels.id ) reservation['Hotel'] = hotels.id;
                    else callback('hotel',reservation);

                    if( hotels && hotels.id ) reservation['Airport'] = hotels.id;
                    else callback('airport',reservation);

                    if( hotels && hotels.id ) reservation['Service Type'] = hotels.id;
                    else callback('transfer',reservation);

                    callback(null,reservation);
                });
            }, function(err,result) { //async cb
                var $r = 'finished'
                if (err) {
                    console.log('err: ');
                    console.log(err);
                }
                console.log('result');
                console.log(result);
                res.json({text : 'success',success : true});
            }); //async end
        }else{
          res.json({text : 'err',success : false});
        }
    });
    //res.json({text : 'err',success : false});
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