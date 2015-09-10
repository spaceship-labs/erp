/**
 * ExportDataController
 *
 * @description :: Server-side logic for managing Exportdatas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment-timezone'),
    anchor = require('anchor');

module.exports = {
    csv: function(req, res){
        var form = req.params.all(),
        invalid = anchor(form).to({
                        type:{
                            model: 'string',
                        }
                    });

        if(invalid)
            return res.json(invalid);

        if(form.sort && form.sortField){
            var sort = {};
            sort[form.sortField] = form.sort;
            form.sort = sort;
        }

        if(form.fieldNames && !form.fieldNames.push){
            form.fieldNames = form.fieldNames.split(',');
            if(form.fieldNames.indexOf('createdAt') == -1){
                form.fieldNames.push('createdAt');
            }
        }

        if(form.filterField && form.filter){
            form.where = {};
            form.where[form.filterField] = form.filter;
        }

        var name = form.model + '-' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
        Export.filter(form, function(err, list){
            if(err) return res.json(err);
            Export.list2csv(list, function(err, csv){
                res.attachment(name);
                res.end(csv, 'UTF-8');
            });
        });
    }
};
