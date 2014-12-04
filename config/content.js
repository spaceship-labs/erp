module.exports.content = {
	hotel : [
		{
			label : 'Nombre',
			type : 'text',
			handle : 'name',
		},
		{
			label : 'Dirección',
			type : 'text',
			handle : 'address',
		},
		{
			label : 'Ciudad',
			type : 'select',
			handle : 'location',
			object : 'locations',
			on_Change : 'getZones()',
		},
		{
			label : 'Zona',
			type : 'select',
			handle : 'zone',
			object : 'zones'
		},
		{
			label : 'Teléfonos',
			type : 'text',
			handle : 'phones',
		},
		{
			label : 'Esquema de Temporadas',
			type : 'select',
			handle : 'seasonScheme',
			object : 'schemes',
		},
	],
	hotelLangs : [
		{
			label : 'Descripcion Español',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripcion Ingles',
			type : 'textarea',
			handle : 'description_en',
		},
		{
			label : 'Descripcion Ruso',
			type : 'textarea',
			handle : 'description_ru',
		},
		{
			label : 'Servicios Español',
			type : 'textarea',
			handle : 'services_es',	
		},
		{
			label : 'Servicios Ingles',
			type : 'textarea',
			handle : 'services_en',	
		},
		{
			label : 'Servicios Ruso',
			type : 'textarea',
			handle : 'services_ru',	
		}
	],
	room : [
		{
			label : 'Nombre Español',
			type : 'text',
			handle : 'name_es',
			required : true,
		},
		{
			label : 'Nombre Ingles',
			type : 'text',
			handle : 'name_en',
		},
		{
			label : 'Nombre Ruso',
			type : 'text',
			handle : 'name_ru',
		},
		{
			label : 'PAX',
			type : 'text',
			handle : 'pax',
		},
		{
			label : 'Tarifa base',
			type : 'money',
			handle : 'fee',
		},
		{
			label : 'Tarifa por temporadas',
			type : 'checkbox',
			handle : 'seasonal',
		},
	],
	season : [
		{
			label : 'Nombre',
			type : 'text',
			handle : 'title',
		},
		{
			label : 'Inicio',
			type : 'date',
			handle : 'start',
			options : {
			    formatYear: 'yy',
			    startingDay: 1
			}
		},
		{
			label : 'Fin',
			type : 'date',
			handle : 'end',
		},
	],
	seasonScheme : [
		{
			label : 'Nombre',
			type : 'text',
			handle : 'name',
		},	
	],
	tour : [
		{
			label : 'Nombre',
			type : 'text',
			handle : 'name',
		},
		{
			label : 'PAX',
			type : 'text',
			handle : 'pax',
		},
		{
			label : 'Tarifa base',
			type : 'money',
			handle : 'fee',
		},
		{
			label : 'Horario General',
			type : 'text',
			handle : 'schedule',
		},
		{
			label : 'Ubicación',
			type : 'select',
			handle : 'location',
			object : 'locations'
		},
	],
	tourLenguajes : [
		{
			label : 'Nombre Español',
			type : 'text',
			handle : 'name_es',
		},
		{
			label : 'Nombre Inglés',
			type : 'text',
			handle : 'name_en',
		},
		{
			label : 'Nombre Rúso',
			type : 'text',
			handle : 'name_ru',
		},
		{
			label : 'Descripción Español',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripción Inglés',
			type : 'textarea',
			handle : 'description_en',
		},
		{
			label : 'Descripción Rúso',
			type : 'textarea',
			handle : 'description_ru',
		},
	],
	location : [
		{
			label : 'Nombre',
			type : 'text',
			handle : 'name',
		},
		{
			label : 'Tiítulo URL',
			type : 'text',
			handle : 'url_title'
		}
	],
	locationTexts : [
		{
			label : 'Descripción Español',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripción Inglés',
			type : 'textarea',
			handle : 'description_en',
		}
	],
	zoneBasic : [
		{
			label : 'Nombre Español',
			type : 'text',
			handle : 'name',
		},{
			label : 'Nombre Inglés',
			type : 'text',
			handle : 'name_en',
		},{
			label : 'Código',
			type : 'text',
			handle : 'code',
		},{
			label : 'Pickup hrs',
			type : 'text',
			handle : 'pickup_hrs',
		},
	],
	zoneComplement : [
		{
			label : 'Título Url',
			type : 'text',
			handle : 'url_title',
		},{
			label : 'Descripción Español',
			type : 'textarea',
			handle : 'description_es',
		},{
			label : 'Descripción Inglés',
			type : 'textarea',
			handle : 'description_en',
		}
	],
	service : [
		{
			label 	: 'Nombre Español',
			type 	: 'text',
			handle 	: 'name'
		},
		{
			label 	: 'Nombre Inglés',
			type 	: 'text',
			handle 	: 'name_en'
		},
		{
			label 	: 'Url ',
			type 	: 'text',
			handle 	: 'url_title'
		},
		{
			label 	: 'Pax por servicio',
			type 	: 'text',
			handle 	: 'max_pax'
		},
		{
			label 	: 'Descripción Español',
			type 	: 'textarea',
			handle 	: 'description_es'
		},
		{
			label 	: 'Descripción Inglés',
			type 	: 'textarea',
			handle 	: 'description_en'
		}
	],
	airport : [
		{
			label 	: 'Nombre',
			type 	: 'text',
			handle 	: 'name'
		},{
			label 	: 'Nombre Inglés',
			type 	: 'text',
			handle 	: 'name_es'
		},{
			label 	: 'Ciudad',
			type 	: 'select',
			handle 	: 'location',
			object 	: 'locations',
			on_Change : 'getZones()',
		},{
			label 	: 'Zona',
			type 	: 'select',
			handle 	: 'zone',
			object 	: 'zones'
		},{
			label 	: 'Texto del Voucher Español',
			type 	: 'textarea',
			handle 	: 'voucher_text_es'
		},{
			label 	: 'Texto del Voucher Inglés',
			type 	: 'textarea',
			handle 	: 'voucher_text_en'
		},
	],
	price : [
		{
			label 	: 'Región',
			type 	: 'select',
			handle 	: 'zone',
			object 	: 'zones'
		},{
			label 	: 'Servicio',
			type 	: 'select',
			handle 	: 'service',
			object 	: 'services'
		},{
			label 	: 'Aeropuerto',
			type 	: 'select',
			handle 	: 'airport',
			object 	: 'airports'
		},{
			label 	: 'Agencia',
			type 	: 'select',
			handle 	: 'company',
			object 	: 'companies'
		},{
			label 	: 'Sencillo',
			type 	: 'text',
			handle 	: 'one_way_fee'
		},{
			label 	: 'Redondo',
			type 	: 'text',
			handle 	: 'round_trip_fee'
		},{
			label 	: 'Activo',
			type 	: 'checkbox',
			handle 	: 'active'
		}
	],
	company : [		
		{
			label : 'Nombre',
			handle : 'name',
			type : 'text',
		},
		{
			label : 'Direccion',
			handle : 'address',
			type : 'text',
		},
		{
			label : 'Código Postal',
			handle : 'zipcode',
			type : 'text',
		},
		{
			label : 'Moneda Base',
			type : 'select',
			handle : 'base_currency',
			object : 'currencies',
		},
		{
			label : 'Aplicaciones',
			type : 'multi-select',
			handle : 'apps',
			object : 'apps',
		},
		{
			label : 'Description',
			handle : 'description',
			type : 'textarea',
		},
	],
    user : [
        {
            label : 'Nombre',
            handle : 'name',
            type : 'text'
        },
        {
            label : 'Apellido',
            handle : 'last_name',
            type : 'text'
        },
        {
            label : 'E-mail',
            handle : 'email',
            type : 'text'
        },
        {
            label : 'Telefono',
            handle : 'phone',
            type : 'text'
        },
        {
            label : 'Activo',
            handle : 'active',
            type : 'checkbox'
        }
    ]
};
