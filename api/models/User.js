/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		default_company:'integer'
		,email:'string'
		,password:'string'
		,role:'integer'
		,name:'string'
		,last_name:'string'
		,icon:'string'
		,active:'integer'
		,phone:'string'
		,registration_date:'date'//createAt
		,access_date:'date'
		
		,companies:'array'//idCompani:appsName
			/*
			[
				{id123123123123123:[app1,app2,app3]}
			]
			*/
	}	
};
