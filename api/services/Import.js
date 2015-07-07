var async = require('async');

function iterDatas(data, model, fnIter, done){

    var datas = data.push ? data: [data],
    modelToLowerCase = model.toLowerCase(),
    content = sails.config.content[modelToLowerCase];
    
    if(!content) return done(new Error('content[model] not found'));

    async.eachSeries(datas, function(single, nextSingle){
        async.each(content, function(item, next){
            fnIter(single, item, next);
        }, nextSingle);
    }, done);

}

function itersDatas(data, model, fnIters, done){
    //para que no se recorra lo mismo por cada paso.
    iterDatas(data, model, function(single, item, next){
        async.eachSeries(fnIters, function(fn, fnDone){
            fn(single, item, fnDone);
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

    if(item.required && !single[item.handle]){
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

function replaceFieldsWithCollection(single, item, next){
 
    if(item.object && single[item.handle]){
        var model = sails.models[item.handle];
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
function normalizeFields(single, item, next){ 

    if(single[item.handle] == undefined){
        for(var i=0; i < normalizeFieldsOptions.length; i++){
            var fieldName = item[normalizeFieldsOptions[i]];
            fieldName = single[fieldName] ? fieldName : fieldName.toLowerCase();
            value = single[fieldName] || single[fieldName.toLowerCase()];
            if(value){
                single[item.handle] = value;
                delete single[fieldName];
                break;
            }
        }
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

    itersDatas(data, model, steps, function(err, data){
       module.exports.import2Model(data, model, done); 
    });

};
