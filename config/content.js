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
			on_Change : 'getZones',
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
			label : 'Categoria',
			type : 'select',
			handle : 'category',
			object : 'categories',
		},
		{
			label : 'Esquema de Temporadas',
			type : 'select',
			handle : 'seasonScheme',
			object : 'schemes',
		},
		{
			label : 'Esquemas de Alimentacion',
			type : 'multi-select',
			handle : 'foodSchemes',
			object : 'foodSchemes',
			removeAction : '/hotel/removeFoodScheme',
		},
	],
	locationRelacion : [
		{
			label : 'Relacionar con otra ciudad',
			type : 'multi-select',
			object : 'locations',
			handle : 'locations'
		}
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
			label : 'Descripcion Portugués',
			type : 'textarea',
			handle : 'description_pt',
		},
		{
			label : 'Servicios Español (separar por enter)',
			type : 'textarea',
			handle : 'services_es',	
		},
		{
			label : 'Servicios Ingles (separar por enter)',
			type : 'textarea',
			handle : 'services_en',	
		},
		{
			label : 'Servicios Ruso (separar por enter)',
			type : 'textarea',
			handle : 'services_ru',	
		},
		{
			label : 'Servicios Portugués (separar por enter)',
			type : 'textarea',
			handle : 'services_pt',	
		},
		{
			label : 'Servicios con costo Español (separar por enter)',
			type : 'textarea',
			handle : 'payed_services_es',	
		},
		{
			label : 'Servicios con costo Ingles (separar por enter)',
			type : 'textarea',
			handle : 'payed_services_en',	
		},
		{
			label : 'Servicios con costo Ruso (separar por enter)',
			type : 'textarea',
			handle : 'payed_services_ru',	
		},
		{
			label : 'Servicios con costo Portugués (separar por enter)',
			type : 'textarea',
			handle : 'payed_services_pt',	
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
			label : 'Nombre Portugués',
			type : 'text',
			handle : 'name_pt',
		},		
		{
			label : 'Vista',
			type : 'multi-select',
			handle : 'views',
			object : 'views',
			removeAction : '/hotel/removeView'
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
	roomDesc : [
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
			label : 'Descripcion Portugués',
			type : 'textarea',
			handle : 'description_pt',
		},
		{
			label : 'Servicios Español (separar por enter)',
			type : 'textarea',
			handle : 'services_es',
		},
		{
			label : 'Servicios Ingles (separar por enter)',
			type : 'textarea',
			handle : 'services_en',
		},
        {
            label : 'Servicios Ruso (separar por enter)',
            type : 'textarea',
            handle : 'services_ru',
        },
		{
			label : 'Servicios Portugués (separar por comma)',
			type : 'textarea',
			handle : 'services_pt',
		},

	/*	{
			label : 'Equipamiento Español',
			type : 'textarea',
			handle : 'equipment_es',
		},
		{
			label : 'Equipamiento Ingles',
			type : 'textarea',
			handle : 'equipment_en',
		},
		{
			label : 'Equipamiento Ruso',
			type : 'textarea',
			handle : 'equipment_ru',
		},
		{
			label : 'Equipamiento Portugués',
			type : 'textarea',
			handle : 'equipment_pt',
		},*/
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
			label : 'Tarifa adultos',
			type : 'money',
			handle : 'fee',
		},
		{
			label : 'Tarifa niños',
			type : 'money',
			handle : 'feeChild',
		},
		{
			label : 'Horario General',
			type : 'text',
			handle : 'schedule',
		},
		{
			label : 'Duracion',
			type : 'text',
			handle : 'duration',
		},
		{
			label : 'Ubicación',
			type : 'select',
			handle : 'location',
			object : 'locations'
		},
		{
			label : 'Traslado incluido',
			type : 'checkbox',
			handle : 'haveTranslate'
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
			label : 'Nombre Portugués',
			type : 'text',
			handle : 'name_pt',
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
		{
			label : 'Descripción Portugués',
			type : 'textarea',
			handle : 'description_pt',
		},
		{
			label : 'Incluye Español',
			type : 'textarea',
			handle : 'includes_es',
		},
		{
			label : 'Incluye Inglés',
			type : 'textarea',
			handle : 'includes_en',
		},
		{
			label : 'Incluye Rúso',
			type : 'textarea',
			handle : 'includes_ru',
		},
		{
			label : 'Incluye Portugués',
			type : 'textarea',
			handle : 'includes_pt',
		},
		{
			label : 'No incluye Español',
			type : 'textarea',
			handle : 'does_not_include_es',
		},
		{
			label : 'No incluye Inglés',
			type : 'textarea',
			handle : 'does_not_include_en',
		},
		{
			label : 'No incluye Rúso',
			type : 'textarea',
			handle : 'does_not_include_ru',
		},
		{
			label : 'No incluye Portugués',
			type : 'textarea',
			handle : 'does_not_include_pt',
		},
		{
			label : 'Recomendaciones Español',
			type : 'textarea',
			handle : 'recommendations_es',
		},
		{
			label : 'Recomendaciones Inglés',
			type : 'textarea',
			handle : 'recommendations_en',
		},
		{
			label : 'Recomendaciones Rúso',
			type : 'textarea',
			handle : 'recommendations_ru',
		},
		{
			label : 'Recomendaciones Portugués',
			type : 'textarea',
			handle : 'recommendations_pt',
		},
	],
	location : [
		{
			label : 'Nombre',
			type : 'text',
			handle : 'name',
		},
		{
			label : 'Título URL',
			type : 'text',
			handle : 'url_title'
		},
		{
			label : 'Código Postal',
			type : 'text',
			handle : 'zipcode'
		},
		{
			label : 'País',
			type : 'text',
			handle : 'country'
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
	transfer : [
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
			on_Change : 'getZones',
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
			handle 	: 'transfer',
			object 	: 'transfers'
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
        {
            label : 'Terminos y condiciones',
            handle : 'terms',
            type : 'textarea-editor'
        },
        {
            label : 'Firma',
            handle : 'footer',
            type : 'textarea-editor'
        }
	],
    user : [
        {
            label : 'Nombre',
            handle : 'name',
            type : 'text',
            required : true
        },
        {
            label : 'Apellido',
            handle : 'last_name',
            type : 'text',
            required : true
        },
        {
            label : 'E-mail',
            handle : 'email',
            type : 'text',
            required : true
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
    ],
    client : [
        {
            label : 'Nombre',
            handle : 'name',
            type : 'text',
            required : true
        },
        {
            label : 'Direccion',
            handle : 'address',
            type : 'text'
        },
        {
            label : 'RFC',
            handle : 'rfc',
            type : 'text'
        },
        {
            label : 'Telefono',
            handle : 'phone',
            type : 'text',
            required : true
        },
        {
            label : 'E-mail',
            handle : 'email',
            type : 'text',
            required : true
        },
        {
            label : 'Ciudad',
            handle : 'city',
            type : 'text'
        },
        {
            label : 'Estado',
            handle : 'state',
            type : 'text'
        },
        {
            label : 'Pais',
            handle : 'country',
            type : 'text'
        },
        {
            label : 'Comentarios',
            handle : 'comments',
            type : 'textarea'
        }
    ],
    client_contact : [
        {
            label : 'Nombre',
            handle : 'name',
            type : 'text'
        },
        {
            label : 'Telefono',
            handle : "phone",
            type : 'text'
        },
        {
            label : 'Extension',
            handle : 'phone_extension',
            type : 'text'
        },
        {
            label : 'E-mail',
            handle : 'email',
            type : 'text'
        },
        {
            label : "Tipo",
            handle : "type",
            type : 'select',
            object : 'contact_types'
        },
        {
            label : 'Puesto',
            handle : 'work_position',
            type : 'text'
        }
    ],
    company_tax : [
        {
            label : 'Nombre',
            handle : 'name',
            type : 'text'

        },
        {
            label : 'Impuesto %',
            handle : 'value',
            type : 'text'
        }
    ],
    packages : [
    	{
    		label : 'Nombre Español',
    		handle : 'name',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		handle : 'name_pt',
    		type : 'text'
    	},
    	{
    		label : 'Servicios Español (separar por enter)',
    		handle : 'services_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Servicios Inglés (separar por enter)',
    		handle : 'services_en',
    		type : 'textarea'
    	},
    	{
            label : 'Servicios Ruso (separar por enter)',
            type : 'textarea',
            handle : 'services_ru',
        },
		{
			label : 'Servicios Portugués (separar por comma)',
			type : 'textarea',
			handle : 'services_pt',
		},
    	{
    		label : 'Descripción Español',
    		handle : 'description_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Inglés',
    		handle : 'description_en',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Ruso',
    		handle : 'description_ru',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Portugués',
    		handle : 'description_pt',
    		type : 'textarea'
    	},
    ],
    packageHotel : [
    	{
    		label : 'Categoria',
    		type : 'select',
			handle : 'category',
			object : 'categories',
    	},
    	{
    		label : 'Nombre Español',
    		handle : 'name_es',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		handle : 'name_pt',
    		type : 'text'
    	},
    	{
    		label : 'Descripción Español',
    		handle : 'description_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Inglés',
    		handle : 'description_en',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Ruso',
    		handle : 'description_ru',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Portugués',
    		handle : 'description_pt',
    		type : 'textarea'
    	}
    ],
    packageDay : [
    	{
    		label : 'Día',
    		handle : 'day',
    		type : 'select-num',
    		required : true,
    		object : 'daysnumber'
    	},
    	{
    		label : 'Ciudad',
    		handle : 'location',
    		type : 'select',
    		required : true,
    		object : 'locations'
    	},
    	{
    		label : 'Nombre Español',
    		handle : 'name_es',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		handle : 'name_pt',
    		type : 'text'
    	},
    	{
    		label : 'Descripción Español',
    		handle : 'description_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Inglés',
    		handle : 'description_en',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Ruso',
    		handle : 'description_ru',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Portugués',
    		handle : 'description_pt',
    		type : 'textarea'
    	}
    ],
    packageDayBasic : [
    	{
    		label : 'Nombre Español',
    		handle : 'name_es',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Día',
    		handle : 'day',
    		type : 'select-num',
    		required : true,
    		object : 'daysnumber'
    	}
    ],
    hotelRoomView : [
    	{
    		label : 'Nombre',
    		handle : 'name',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		handle : 'name_pt',
    		type : 'text'
    	}
    ],
    foodschemes : [
    	{
    		label : 'Nombre',
    		handle : 'name',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		handle : 'name_pt',
    		type : 'text'
    	}
    ]
};
