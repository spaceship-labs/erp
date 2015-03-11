/**
 * CuponController
 *
 * @description :: Server-side logic for managing cupons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `CuponController.index()`
   */
  index: function (req, res) {
  	Cupon.find().exec(function(e,cupons){
  		Common.view(res.view,{
			cupons:cupons,
			page:{
				name:req__('sc_cupons')
				,icon:'fa fa-ticket'		
				,controller : 'cupon.js'
			},
			breadcrumb : [
				{ label : req__('sc_cupons') }
			]
		},req);
  	},req);
  }
  ,edit:function(req,res){
  	Cupon.findOne({id:req.param('id')}).exec(function(e,cupon){
		if(e || !cupon) res.notFound()
		console.log(cupon);
  		Common.view(res.view,{
			cupon:cupon,
			page:{
				name:cupon.name
				,icon:'fa fa-ticket'		
				,controller : 'cupon.js'
			},
			breadcrumb : [
				{ label : req__('sc_cupons') }
			]
		},req);
  	},req);
    
  }
};

