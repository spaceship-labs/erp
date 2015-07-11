/**
 * ImportDataController
 *
 * @description :: Server-side logic for managing importdatas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function(req, res){
        console.log('index');
        res.ok({yl:1});
    },
    upload: function(req, res){
        var form = req.params.all(),
            dir = 'tmpImport',
            dirSave = __dirname+'/../../assets/uploads/'+dir+'/';
        Files.saveFiles(req, {dir: dir}, function(err, files){
            console.log('err', err);
            if(err && !files.length) return res.ok({ success:false, error: err.message });
            console.log('upload correcto', files);
            Import.files.xlsx2Json(dirSave + files[0].filename, function(err, book){
                console.log('xlsx err', err);
                if(err) return res.ok({ success:false, error: err.message});
                res.ok({success: true, sheets:book.sheets});
            });
        });
    }
};

