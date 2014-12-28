/**
* Notice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		companyId:'string'
		,userId:{
			model:'user',
		}
		,app:'string'
		,model:'string'
		,operation:'string'
		,modifyId:'string'
		,modelObjName:'string'
		,modifications:'array'
		,val:'json'
	}
};

