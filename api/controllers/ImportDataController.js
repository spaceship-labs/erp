/**
 * ImportDataController
 *
 * @description :: Server-side logic for managing importdatas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    upload: function(req, res){
        var form = req.params.all(),
            dir = 'tmpImport',
            dirSave = __dirname+'/../../assets/uploads/'+dir+'/';
        Files.saveFiles(req, {dir: dir}, function(err, files){
            if(err && !files.length) return res.ok({ success:false, error: err.message });
            Import.files.xlsx2Json(dirSave + files[0].filename, function(err, book){
                if(err) return res.ok({ success:false, error: err.message});
                res.ok({success: true, sheets:book.sheets});
            });
        });
    },
    importJson: function(req, res){
        var form = req.params.all(),
            company = req.session.select_company || req.user.select_company;
        //console.log(form);
        Import.files.array2Model(form.values, {company: company} ,function(err, objs){
            Import.checkAndImport(objs, form.model, function(err, creates){
                console.log(err, creates);
                if(err) return res.ok({success:false, error:err.message});
                res.ok({success: true, creates: creates});
            });
        });
        //res.ok({a:1})
    }
};

