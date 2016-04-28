/**
 * TransportPriceController
 *
 * @description :: Server-side logic for managing Transportprices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function(req, res){
        async.parallel({
            zones: function(done){
                Zone.find().exec(done);
            },

            prices: function(done){
                TransportPrice.find().populateAll().exec(done);
            },
            locations: function(done){
                Location.find().exec(done);
            }
        
        }, function(err, data){
            Common.view(res.view,{
                prices: data.prices,
                zones: data.zones,
                locations: data.locations,
                page:{
                    name:req.__('price'),
                    icon:'fa fa-money',
                    controller : 'transport.js'
                }
            },req);
        });

    }

	
};

