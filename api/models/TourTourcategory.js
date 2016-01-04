/**
* TourTourcategory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName : 'tour_categories__tourcategory_tours'
  	,attributes: {
  		value : 'integer'
  		,tourcategory_tours : { //categoría
  			model : 'tourcategory'
  		}
  		,tour_categories : { //tour
  			model : 'tour'
  		}
  	}
};

