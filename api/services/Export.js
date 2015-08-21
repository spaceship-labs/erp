var Export = exports = module.exports = {},
    async = require('async'),
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
    async.eachSeries(Object.keys(item), function(field, nextField){
        var fieldName = prefix + field,
            index = fields.indexOf(fieldName),
            val = item[field],
            valType = getType(val);

        if(index == -1 && valType != 'object'){
            fields.push(fieldName); 
            index = fields.indexOf(fieldName);
        }

        if(valType == 'object'){
            normalizeFields(fields, vals, val, field + '/', function(err){
                nextField();
            });
            
        }else if(valType == 'array'){
            var json = JSON.stringify(val);
            vals[index] = json.replace(/,/g,'|');
            nextField();
        }else{
            vals[index] = val;
            nextField();
        }
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

Export.model2csv = function(model, done){
    model = model.push && model || [model];

    Export.normalizeFields(model, function(err, list){
        csv.stringify(list, function(err, data){ 
           done(err, data);
        });
    });
};
