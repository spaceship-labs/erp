/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index : function(req,res){
		//aquí van los reportes impresos
		Common.view(res.view,{
			thecompany : req.user.default_company,
			_content:sails.config.content,
			page:{
				name : 'Reportes',
				icon : 'fa fa-bar-chart-o',
				controller : 'report.js',
			}
		},req);
	},
	charts : function(req,res){
		//aqué se mostrarán las gráficas más adelante
	}
	
};

