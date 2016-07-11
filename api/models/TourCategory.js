/**
* TourCategory.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	name : 'String'
  	,name_en : 'String'
  	,name_ru : 'String'
  	,name_pt : 'String'
    ,principal : 'boolean'
    ,tours : { collection : 'tour', via: 'categories' }
  	//,tours : { collection : 'tourtourcategory', via: 'tourcategory_tours' }
    ,type : {
      type: 'String'
      ,enum : ['normal', 'rate','accesibility']
      /* Aquí se pueden ir agregando las variantes de categorías que podemos ir agregando
        normal: categorías normales
        rate : categorías numéricas, barras
        accesibility : categorias de accesibilidad (acepta adultos , bebes , ancianos , etc) , util para filtros
      */
    }
    ,rating : 'array'
    ,classification : {
      type : 'String'
      ,enum : [ 'aquatic', 'land' ]
    }
    ,url : 'string'
    ,meta_title_es:'string'
    ,meta_description_es:'string'
    ,meta_keywords_es:'string'
    ,meta_title_en:'string'
    ,meta_description_en:'string'
    ,meta_keywords_en:'string'       
  }
  ,beforeUpdate:function(val,cb){
    cb();
  }
  ,beforeCreate: function(val,cb){
    if (!val.name) {
      return cb({err: ["Must have a username!"]});
    }
    val.url = val.name.replace(/\s+/g, '').toLowerCase();
    cb();
  }
};

