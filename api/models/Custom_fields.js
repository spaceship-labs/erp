/**
* Custom_fields.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name:'string'
		,type:{
			type:'string'
			,enum:['numero','text','textarea','select','fecha']
		}
		,values:'array'
	  	,product:{
	  		model : 'product_type',
	  	}
	}
};

