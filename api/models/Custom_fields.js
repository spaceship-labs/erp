/**
* Custom_fields.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name:'string'
		,user:{
			model:'user'
		}
		,company:{
			model:'companies'
		}
		,type:{
			type:'string'
			,enum:['text','textarea','select']
		}
		,values:'array'
	  	,product:{
	  		model : 'product_type',
	  	}
	}
};

