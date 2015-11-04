/**
 * TransportAsignRequestController
 *
 * @description :: Server-side logic for managing Transportasignrequests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function(req, res){
        Company.find().exec(function(err, companies){
            Common.view(res.view,{
                select_view: 'transportasign/index',
                type: 'request',
                companies: companies,
                page:{
                    name:req.__('request'),
                    icon:'fa fa-clock-o',
                    controller : 'transportasign.js'
                },
                breadcrumb : [
                    {label : req.__('sc_transfer')}
                ]
            },req);
        });
    },
};

