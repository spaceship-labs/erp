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
        Files.saveFiles(req, {dir: dir, disableCloud: true }, function(err, files){
            if(err && !files.length) return res.ok({ success:false, error: err.message });
            Import.files.xlsx2Json(dirSave + files[0].filename, function(err, book){
                if(err) return res.ok({ success:false, error: err.message});
                res.ok({success: true, sheets:book.sheets});
            });
        });
    },
    importJson: function(req, res){
        var form = req.params.all(),
        add = {
             //req: req// tarda demasiado si se quiere que se loguee en el panel (notificacion) por obvias razones.
        };
        if(form.model == 'company'){
            add.active = true; 
            add.users = [req.user.id];
        }else{
            add.company = req.session.select_company || req.user.select_company;
        }
        //console.log(form);
        Import.files.array2Model(form.values, add, function(err, objs){
            Import.checkAndImport(objs, form.model, function(err, creates){
                console.log(err, creates);
                if(err) return res.ok({success:false, error:err.message});
                res.ok({success: true, creates: creates});
            });
        });
        //res.ok({a:1})
    }
};

