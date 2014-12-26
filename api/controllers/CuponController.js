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
				name:'Cupons'
				,icon:'fa fa-ticket'		
				,controller : 'cupon.js'
			},
			breadcrumb : [
				{ label : 'Cupones' }
			]
		},req);
  	},req);
  }
};

