var async = require('async'),
    spreadSheet = require('pyspreadsheet').SpreadsheetReader,
    util = require('util');

function iterDatas(data, model, fnIter, done){
    var datas = data.push ? data: [data],
    modelToLowerCase = model.toLowerCase(),
    content = sails.config.content[modelToLowerCase];
    
    if(!content) return done(new Error('content['+model.toLowerCase()+'] not found'));

    async.eachSeries(datas, function(single, nextSingle){
        async.each(content, function(item, next){
            fnIter(single, item, next, model);
        }, nextSingle);
    }, done);

}

function itersDatas(data, model, fnIters, done){
    //para que no se recorra lo mismo por cada paso.
    iterDatas(data, model, function(single, item, next){
        async.eachSeries(fnIters, function(fn, fnDone){
            fn(single, item, fnDone, model);
        }, next);
    
    }, function(err){
        if(err) return done(err);
        done(null, data, model);    
    });

}

module.exports.import2Model = function(data, model, done){

    var modelObj = sails.models[model] || global[model] ;
    if(!modelObj) return done(new Error('Not found model'));
    modelObj.create(data).exec(done);

};

function ifContentValid(single, item, next){
    if(item.required && single[item.handle] != '' && !single[item.handle]){
        return next(new Error('Field '+item.handle+' is required'));
    }
    return next(); 

}

module.exports.ifContentValid = function(data, model, done){

    iterDatas(data, model, ifContentValid , function(err){
        if(err) return done(err);
        done(null, data, model);
    });

};

function replaceFieldsWithCollection(single, item, next, modelBase){ 
    if(item.object && single[item.handle]){
        var model = sails.models[item.handle],
        attr = sails.models[modelBase] && sails.models[modelBase].attributes;
        if(!model){
            if(attr && attr[item.handle]){
                model = sails.models[attr[item.handle].model];
            }else{
                next(new Error('No model found'));
            }
        }
        //console.log(modelBase);
        model.findOne({
            or: [
                { name: single[item.handle] },
                { id: single[item.handle]}
            ]
        }).exec(function(err, find){
            if(err) return next(err);
            if(find){
                single[item.handle] = find.id;
                next();
            }else{
                model.create({ name: single[item.handle] })
                     .exec(function(err, newModel){
                        if(err) return next(err);
                        single[item.handle] = newModel.id;
                        next();
                     });
            }
        
        });
    }else{
        next();
    }

}

module.exports.replaceFieldsWithCollection = function(data, model, done){

    iterDatas(data, model, replaceFieldsWithCollection, function(err){
        if(err) return done(err);
        done(null, data, model);
    });

};


var normalizeFieldsOptions = ['label', 'label_en'];
var normalizeFieldsAlias = ['name', 'name_en', 'name_pt', 'name_ru'];
function normalizeFields(single, item, next){ 
    for(var key in single){
        keyLowerCase = key.toLowerCase();
        if(key != keyLowerCase){
            single[keyLowerCase] = single[key];
            delete single[key];
        }
    }
    if(single[item.handle] == undefined){
        for(var i=0; i < normalizeFieldsOptions.length; i++){
            var fieldName = item[normalizeFieldsOptions[i]].toLowerCase(),
            value = single[fieldName] || single[fieldName.toLowerCase()];
            if(value){
                delete single[fieldName];
                single[item.handle] = value;
                break;
            }
        }
    }
    if(item.required && !single[item.handle] && normalizeFieldsAlias.indexOf(item.handle) != -1){
        single[item.handle] = single.name;
    }
    if(item.required && (item.default || item.default == '') && !single[item.handle]){ 
        single[item.handle] = item.default;
    }
    next();

}

module.exports.normalizeFields = function(data, model, done){

    iterDatas(data, model, normalizeFields, function(err){
        if(err) return done(err);
        done(null, data, model);
    });

};

var steps = [ normalizeFields, ifContentValid, replaceFieldsWithCollection ]
module.exports.checkAndImport = function(data, model, done){

    itersDatas(data, model, steps, function(err, dataTransform){
        if(err) return done(err);
        module.exports.import2Model(dataTransform, model, done); 
    });

};

//docs.
var files = {};

files.xlsx2Json = function(src, done){
    spreadSheet.read(src, function(err, book){
        if(err) return done(err);
        var bookFormat = { sheets: [] };
        book.sheets.forEach(function(sheet){
            var sheetFormat = {};
            sheetFormat.name = sheet.name;
            sheetFormat.values = []
            sheet.rows.forEach(function(row,i){
                var isRowEmpty = true;
                for(var r=0;r < row.length; r++){
                    if(row[r].value != null){
                        isRowEmpty = false;
                        break;
                    }
                }
                if(isRowEmpty)
                    return;

                sheetFormat.values.push(row.map(function(cell){
                    return cell.value;
                }));
            });
            bookFormat.sheets.push(sheetFormat);
        });
        done(null, bookFormat);
    });
    
};

files.array2Model = function(sheet, objBase, done){
    
    var models = [],
        head = [],
        list = (sheet && sheet.push) ? sheet : (sheet && sheet.values || false);

    if(!done){
        done = objBase;
        objBase = {};
    }

    if(!list)
        return done(new Error('No data found'));
    list.forEach(function(val){
        if(!head.length && val[0]){//name of fields.
            head = val; 
        }else if(head.length){
            var obj = util._extend({}, objBase);
            head.forEach(function(h,i){
                obj[h] = val[i];
            });
            models.push(obj);
        }
    });
    done(null, models);
};

files.xlsx2model = function(src, done){
    files.xlsx2Json(src, function(err, book){
        async.map(book.sheets, files.array2Model, done);
    });
};

files.fromXlsx = function(src, sheet, model, done){
    if(!parseInt(sheet)){ 
        //optional sheet number, default 1.
        var tmp = model;
        model = sheet;
        sheet = 1;
        done = tmp;
    }
    sheet--;
    files.xlsx2model(src, function(err, datas){
        if(err) return done(err);
        var data = datas[0];
        module.exports.checkAndImport(data, model, done);
    });
}

module.exports.files = files;
