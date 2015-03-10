/**
 * CuponController
 *
 * @description :: Server-side logic for managing cupons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
module.exports = {
    index: function (req, res) {
        commonFinds({},function(err,finds){
            finds.user = {
                id:req.user.id,
                company:req.user.select_company
            };
            finds.page = {
                name:'Cupons',
                icon:'fa fa-ticket',
                controller : 'cupon.js'
            };
            finds.breadcrumb = [
                { label : 'Cupones' }
            ];
            Common.view(res.view,finds,req);        
        });
    },
    edit:function(req,res){
        commonFinds({id:req.param('id')},function(err,finds){
            finds.cupon = finds.cupons[0];
            finds.page = {
                name:finds.cupon.name,
                icon:'fa fa-ticket',
                controller : 'cupon.js'
            };
            finds.breadcrumb = [
                { label : 'Cupones' }
            ];
            Common.view(res.view,finds,req); 
        });
    },
    removeHotel:function(req,res){
        commonRemove(req.params.all(),'hotels',res);
    },
    removeTour:function(req,res){
        commonRemove(req.params.all(),'tours',res);
    },
    removeTransfer:function(req,res){
        commonRemove(req.params.all(),'transfers',res);
    }
};

function commonRemove(params,collection,res){ 
    Cupon.findOne({id:params.obj}).exec(function(e,cupon){
        if(e) throw(e);
        cupon[collection].remove(params.rel);
        cupon.save(function(e,rs){
            if(e) throw(e);
            res.json(rs);
        });
    });
}

function commonFinds(cuponFind,done){  
    async.parallel({
        cupons:function(next){
            var find = Cupon.find(cuponFind);
            if(cuponFind && cuponFind.id)
                find = find.populateAll();

            find.exec(function(err,cupons){
                next(err,cupons);
            }); 
        },
        hotels:function(next){
            Hotel.find().sort('name').exec(function(err,hotels){
                next(err,hotels);
            }); 
        },
        tours:function(next){
            Tour.find().sort('name').exec(function(err,tours){
                next(err,tours);
            });
        },
        transfers:function(next){
            Transfer.find().sort().exec(function(err,transfers){
                next(err,transfers);
            });
        }
    },done);
}
