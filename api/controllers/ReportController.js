/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index : function(req,res){
		//aquí van los reportes impresos
		Common.view(res.view,{
			thecompany : req.user.default_company,
			_content:sails.config.content,
			page:{
				name : 'Reportes',
				icon : 'fa fa-bar-chart-o',
				controller : 'report.js',
			}
		},req);
	},
	charts : function(req,res){
		//aqué se mostrarán las gráficas más adelante
	},
	totalsreport : function(req,res){
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
	      fields.company = { "$in" : c_ };
	    }
	    console.log('FIELDS 0:',fields)
	    Reports.getReport('totalsReport',fields,function(results,err){
	      Export.mkp_report(results,function(err,csv){
	        var name = 'Reporte m' + '.csv';
	        res.attachment(name);
	        res.end(csv, 'UTF-8');
	      });
	    });
	}	
};
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