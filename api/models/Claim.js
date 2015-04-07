/**
* Claim.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		order : { model : 'order' }
  		,user : { model : 'user' }
	},labels : {
	    es : 'Quejas'
	    ,en : 'Claims'
	}
	, attrs_labels : {
		answer : { es: 'Respuesta' , en: 'Answer' }
		,claim_text : { es: 'Queja' , en: 'Claim' }
		,driver : { es: 'Operador' , en: 'Driver' }
		,type : { es: 'Tipo de queja' , en: 'Claim type' }
		,end_date : { es: 'Fecha de resolución' , en: 'Termination date' }
		,department : { es: 'Departamento' , en: 'Department' }
		,followup : { es: 'Seguimiento' , en: 'Follow up' }
	}
	,afterCreate: function(val,cb){
		Notifications.after(Claim,val,'create');
		cb()
	},afterUpdate: function(val,cb){
		Notifications.after(Claim,val,'update');
		cb();
	},beforeUpdate:function(val,cb){
		Notifications.before(val);
		cb();
	},beforeCreate: function(val,cb){
		Notifications.before(val);
		cb();
	}
};

