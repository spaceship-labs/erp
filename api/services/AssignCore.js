module.exports.assignReservation = function(params,callback){
	var id = params.id;
	delete params.id;
	delete params.asign.id;
	params.asign.reservation = id;
	TransportAsign.create(params.asign).exec(function(err,asigned){
		if(err) return callback(err,false);
		delete params.asign;
		params.asign = asigned.id;
		Reservation.update({id:id},params,function(err,r){
			if(err) return callback(err,false);
			Reservation.findOne(id).populateAll().exec(callback);
		});
	});
};
module.exports.formatFilterFields = function(f){
	var fx = { };
	fx['$or'] = [];
  for( var x in f ){
    if( f[x].model ){
      if( f[x].type == 'date' ){
      	var from = {}; from[f[x].field] = { '>=' : new Date(f[x].model.from) };
        var to = {}; to[f[x].field] = { '<=' : new Date(f[x].model.to) };
        if( f[x].options && f[x].options.oneDate ){
        	var field = {};
        	field[f[x].field] = f[x].model.from;
        	fx['$or'].push(field);
        }else{
        	if( f[x].field == 'arrival_date' ){
	          fx['$or'] = [ 
	            { $and : [ from, to ] }, 
	            { $and : [ { startDate : { '$gte' : new Date(f[x].model.from) } }, { startDate : { '$lte' : new Date(f[x].model.to) } } ] }, 
	            { $and : [ { cancelationDate : { '$gte' : new Date(f[x].model.from) } }, { cancelationDate : { '$lte' : new Date(f[x].model.to) } } ] }
	            ]
	        }else{
	          fx['$and'] = [from,to];
	        }
        }
        //fx['$or'].push({ $and : [ from, to ] });
        //fx['$or'].push({ field : { '=' : new Date(f[x].model.from) } });
        //fx['$or'].push({ field : { '=' : new Date(f[x].model.to)   } });
        /*if( f[x].field == 'arrival_date' ){
          fx['$or'] = [ 
            { $and : [ from, to ] }, 
            { $and : [ { startDate : { '>=' : new Date(f[x].model.from) } }, { startDate : { '<=' : new Date(f[x].model.to) } } ] }, 
            { $and : [ { cancelationDate : { '>=' : new Date(f[x].model.from) } }, { cancelationDate : { '<=' : new Date(f[x].model.to) } } ] }
            ]
        }else{
          fx['$and'] = [from,to];
        }*/
      }else if( f[x].type == 'autocomplete' ){
          fx[ f[x].field ] = f[x].model.item.id;
      }else if( f[x].type == 'select' || f[x].type == 'text' || f[x].type == 'number' ){
          fx[ f[x].field ] = f[x].type=='number'?parseInt(f[x].model.item):f[x].model.item;
      }
    }
  }
  //console.log(fx['$or']);
  if( fx['$or'].length == 0 ) delete fx['$or'];
  return fx;
};
module.exports.divideReservations = function(reservations){
	var result = { asigned : [] , notAsigned : [] };
	for( var x in reservations ){
		if( reservations[x].asign )
			result.asigned.push( reservations[x] );
		else
			result.notAsigned.push( reservations[x] );
	}
	return result
}
module.exports.getReservationsDivided = function(params,user,callback){
	//configurar parámetros
	var skip = params.skip || 0;
    var limit = params.limit || 100;
	params.fields = AssignCore.formatFilterFields(params.fields);
	params.conditions = {};
	if( !user.company.adminCompany && user.company.company_type == 'transport' ){
		params.ta = { company : sails.models['company'].mongo.objectId(user.company.id) };
		AssignCore.getReservationsByTransportist(params,function(err,reservations){
			return callback(err, AssignCore.divideReservations(reservations) );
		});
	}else{
		if( !user.company.adminCompany && user.company.company_type == 'agency' )
	        params.conditions.company = user.company.id;
		var conditions = params.conditions;
		Reservation.find(conditions).where(params.fields).populateAll().limit(limit).skip(skip).exec(function(err,reservations){
			return callback(err, AssignCore.divideReservations(reservations) );
		});
	}
};
module.exports.getReservationsByTransportist = function(params,callback){
	var skip = params.skip || 0;
    var limit = params.limit || 100;
	var $match = params.ta || {};
	var $groupGral = {
		_id : null
		,reservationsIDs : { '$push' : '$reservation' }
	};
	delete params.ta;
	TransportAsign.native(function(err,TA){
		TA.aggregate([ 
			{ $sort : { createdAt : -1 } }, { $match : $match }
			,{ $group : $groupGral } 
		],function(err,tas){ 
			tas = tas[0];
			params.fields.id = tas.reservationsIDs;
			Reservation.find().where(params.fields).populateAll().limit(limit).skip(skip).exec(function(err,reservations){
				return callback(err,reservations);
			});
		});
	});
}
/*
	Entre los parámetros debe de recibir siempre: 
		company : Transportista de la cual queremos obtener los vehículos
		transfer : Servicio que se va a llevar a cabo para obtener los vehículos posibles
*/
module.exports.getVehicles = function(params,callback){
	Transfer.findOne(params.transfer).populateAll().exec(function(err,transfer){
		if( err ) return callback(err,false);
		//transporttypes ->estos tienen los vehículos
		var condiciones = {
			$or : [
				{ transfer : params.transfer.id || params.transfer }
				,{ transfers : params.transfer.id || params.transfer }
			]
		}
		//console.log(condiciones);
		TransportType.find(condiciones).populateAll().exec(function(err,types){
			//console.log(types.transports.length);
			var vehicles = [];
			for(var x in types){
				for(var y in types[x].transports){
					var aux = Common.getIndexById(types[x].transports[y].id,vehicles);
					if( aux < 0 ){
						var vehicle = types[x].transports[y];
						vehicle.transfer = types[x].transfer.id==params.transfer?types[x].transfer:false;
						vehicle.transfertype = types[x].name;
						vehicle.transfers = [];
					}else if( vehicles[aux] && !vehicles[aux].transfer && types[x].transfer.id==params.transfer ){
						var vehicle = vehicles[aux];
						vehicle.transfer = types[x].transfer;
						vehicle.transfertype = types[x].name;
						for(var z in types[x].transfers)
							if( vehicle.transfers.indexOf(types[x].transfers[z].id) == -1 )
								vehicle.transfers.push( types[x].transfers[z].id );
					}
					for(var z in types[x].transfers)
						if( types[x].transfers[z] && vehicle.transfers.indexOf(types[x].transfers[z].id) == -1 )
							vehicle.transfers.push( types[x].transfers[z].id );
					if( aux < 0 && vehicle ) vehicles.push(vehicle);
					else if(vehicles[aux]) vehicles[aux] = vehicle;
				}
			}
			return callback(false,vehicles);
		});
	});
};