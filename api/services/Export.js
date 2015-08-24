var Export = exports = module.exports = {},
    async = require('async'),
    moment = require('moment'),
    csv = require('csv');

var objToString = ({}).toString;
function getType(obj){
    return objToString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

function replaceFieldsNonExistent(data, length, done){
    var i = 0;
    async.each(new Array(length), function(t, next){
        if(data[i] == undefined){
            data[i] = '';
        }
        i++;
        next();
    }, function(err){
        done(err, data);
    });
}

function normalizeFields(fields, vals, item, prefix, done){
    if(!done){
        done = prefix;
        prefix = '';
    }
    var keys = Object.keys(item.toObject ? item.toObject() : item );
    async.each(keys, function(field, nextField){
        var fieldName = prefix + field,
            index = fields.indexOf(fieldName),
            val = item[field],
            valType = getType(val);

        if(valType == 'function'){
            return nextField();
        }

        if(index == -1 && valType != 'object'){
            fields.push(fieldName); 
            index = fields.indexOf(fieldName);
        }

        if(valType == 'object'){
            return normalizeFields(fields, vals, val, field + '/', function(err){
                nextField();
            }); 
        }else if(valType == 'array'){ //if length...
            var json = val.length ? JSON.stringify(val) : '';
            vals[index] = json.replace(/,/g,'|');
        }else if(valType == 'date'){
            vals[index] = moment(val).format('D/MM/YYYY:h:mm:ss a');
        }else{
            vals[index] = val;
        }

        nextField();
    }, 
    done);

}

Export.normalizeFields = function(data, done){
    var fields = [],
        res = [];
    async.eachSeries(
        data.push && data || [data],
        function(item, next){
            var vals = [];
            normalizeFields(fields, vals, item, function(err){
                if(err) return next(err);
                replaceFieldsNonExistent(vals, fields.length, function(err, data){
                    res.push(data);
                    next();
                });            
            });
        },function(err){
            res.unshift(fields);
            done(err, res);
        });
};

Export.list2csv = function(model, done){
    model = model.push && model || [model];

    Export.normalizeFields(model, function(err, list){
        csv.stringify(list, function(err, data){ 
           done(err, data);
        });
    });
};


var filters = ['where', 'limit', 'sort'];
//Export.filter({model:'user', sort:{createdAt:'desc'}, fieldNames:['name']}, console.log)
Export.filter = function(opts, done){
    opts = opts || {};
    opts.fields = opts.fieldNames ? {fields: opts.fieldNames} : {}; //{fields:['name']}}
    var model = sails.models[opts.model];
    if(!model){
        return done(new Error('No model found'));
    }

    var defer = model.find({}, opts.fields);
    async.eachSeries(filters, function(filt, next){
        if(opts[filt] && defer[filt])
            defer = defer[filt](opts[filt]);
        next();
    }, function(err){
        if(err) return done(err);
        if(Object.keys(opts.fields).length && !opts.limit){
            // if filter fields limit is required
            model.count(function(err, count){
                if(err) return done(err);
                defer.limit(count).exec(done);
            });    
        }else{
            defer.exec(done);
        }
    });
};
