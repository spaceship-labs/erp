/**
* Tour.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		location : {
			model : 'location' }
		,days : 'array'
		,schedules : 'array'
		//,departurePoints : 'json'
		,seasonScheme : {
			model:'seasonScheme',
			via:'tours' }
		,cupons : {
			model:'cupon',
			via:'tours' }
		,categories : { collection : 'tourcategory',via:'tours' }
		//,categories : { collection : 'tourtourcategory', via:'tour_categories' }
		,pax : 'integer'
		,fee : 'float' // precio de venta
		,feeChild : 'float' //precio de venta
		,fee_base : 'float' //precios de proveedor
		,feeChild_base : 'float' //precios de proveedor
		,commission_agency : 'float'
		,commission_sales : 'float'
		,commission_agency_base : 'integer'
		,commission_user_base : 'integer'
		,provider : {
			model : 'tourprovider' }
		,agencies : {
			collection : 'companyproduct'
			, via : 'tour' }
		,duration_formated : 'datetime'
		,type : {
			type: 'string',
			enum: ['family', 'adult'],
			defaultsTo : 'family'
		}
		,url : 'string'

        ,priceType : {
            type : 'string',
            enum: ['single', 'group'],
            defaultsTo : 'single'
        }
        ,price : {
            model : 'price'
        }
        ,extra_prices : {
            collection : 'price',
            via : 'tour'
        }
        ,duration : {
            type : 'integer'
        }
        ,status : {
            type: 'string',
            enum: ['inactive', 'active','draft'],
            defaultsTo : 'draft'
        }
        ,transferHotels : {
            collection : 'Hotel',
            via : 'transferTours',
            dominant : true
        }
        ,zone : {
            model : 'zone'
        }
        ,provider_locations : {
            collection : 'Place',
            via : 'tour'
        }
        
	    ,meta_title_es:'string'
	    ,meta_description_es:'string'
	    ,meta_keywords_es:'string'
	    ,meta_title_en:'string'
	    ,meta_description_en:'string'
	    ,meta_keywords_en:'string'
        ,tax : 'float' //aún no se que se va a hacer con esto, me lo mandaron de yellow :/
        //duration_type ?
        ,departurepoints : {
        	collection : 'departurepoint'
        	,via : 'tours'
        }
	}
	, migrate : 'safe'
	, attrs_labels : {
		name : { es : 'Nombre' , en : 'Name' }
		,name_en : { es : 'Nombre Inglés' , en : 'Name English' }
		,name_ru : { es : 'Nombre Ruso' , en : 'Name Russian' }
		,name_pt : { es : 'Nombre Portugués' , en : 'Name Portuguese' }
		,location : { es : 'Ciudad' , en : 'City' }
		,categories : { es : 'Categorías' , en : 'Categories' }
		,fee : { es : 'Tarifa' , en : 'Rate' }
		,feeChild : { es : 'Tarífa menores' , en : 'Fee child' }
		,pax : { es : 'Personas' , en : 'People' }
		,days : { es : 'Días' , en : 'Days' }
		,seasonScheme : { es : 'Esquema de temporadas' , en : 'Seasons scheme' }
		,schedule : { es : 'Horario' , en : 'Schedule' }
		,duration : { es : 'Duración' , en : 'Duration' }
		,provider : { es : 'Proveedor' , en : 'Provider' }
		,visible : { es : 'Visible en web' , en : 'Web visible' }
		,haveTransfer : { es : 'Transporte incluido' , en : 'Transfer included' }
		,description_es : { es : 'Descripción Español' , en : 'Spanish description' }
		,description_en : { es : 'Descripción Inglés' , en : 'English description' }
		,description_ru : { es : 'Descripción Ruso' , en : 'Russian description' }
		,description_pt : { es : 'Descripción Portugués' , en : 'Portuguese description' }
		,includes_es : { es : 'Incluye Español' , en : 'Spanish include' }
		,includes_en : { es : 'Incluye Inglés' , en : 'English include' }
		,includes_ru : { es : 'Incluye Ruso' , en : 'Russian include' }
		,includes_pt : { es : 'Incluye Portugués' , en : 'Portuguese include' }
		,does_not_include_es : { es : 'No incluye Español' , en : 'Spanish does not include' }
		,does_not_include_en : { es : 'No incluye Inglés' , en : 'English does not include' }
		,does_not_include_ru : { es : 'No incluye Ruso' , en : 'Russian does not include' }
		,does_not_include_pt : { es : 'No incluye Portugués' , en : 'Portuguese does not include' }
		,recommendations_es : { es : 'Recomendaciones Español' , en : 'Spanish recommendations' }
		,recommendations_en : { es : 'Recomendaciones Inglés' , en : 'English recommendations' }
		,recommendations_ru : { es : 'Recomendaciones Ruso' , en : 'Russian recommendations' }
		,recommendations_pt : { es : 'Recomendaciones Portugués' , en : 'Portugués recommendations' }
	}
	,labels : { es : 'Tours', en : 'Tours' }
  	,afterCreate: function(val,cb){
		Notifications.after(Tour,val,'create');

        if (val.fee) {
            var price = {
                fee : val.fee,
                feeChild : val.feeChild,
                tour : val.id
            };
            Price.create(price).exec(function(err,res){
                val.price = res.id;
                cb();
            });
        } else {
            cb();
        }
	}
	,afterUpdate: function(val,cb){
		Notifications.after(Tour,val,'update');
        cb();
	}
	,beforeUpdate:function(val,cb){

            Notifications.before(val);
            cb();
	}
	,beforeCreate: function(val,cb){
		if (!val.name) {
			return cb({err: ["Must have a name!"]});
		}

		val.url = Common.stringReplaceChars(val.name);

		Notifications.before(val);
		cb();
	}
};
