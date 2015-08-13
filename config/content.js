module.exports.content = {
	hotel : [
		{
			label : 'Nombre',
			label_en : 'Name',
			type : 'text',
			handle : 'name',
			required : true,
		},
		{
			label : 'Dirección',
			label_en : 'Address',
			type : 'text',
			handle : 'address',
		},
		{
			label : 'Ciudad',
			label_en : 'City',
			type : 'select',
			handle : 'location',
			object : 'locations',
			on_Change : 'getZones',
			required : true,
		},
		{
			label : 'Zona',
			label_en : 'Zone',
			type : 'select',
			handle : 'zone',
			object : 'zones',
			required : true,
		},
		{
			label : 'Teléfonos',
			label_en : 'Phones',
			type : 'text',
			handle : 'phones',
		},
		{
			label : 'Categoría',
			label_en : 'Category',
			type : 'select',
			handle : 'category',
			object : 'categories',
		},
		{
			label : 'Esquema de Temporadas',
			label_en : 'Seasons scheme',
			type : 'select',
			handle : 'seasonScheme',
			object : 'schemes',
		},
		{
			label : 'Esquemas de Alimentacion',
			label_en : 'Nutrition scheme',
			type : 'multi-select',
			handle : 'foodSchemes',
			object : 'foodSchemes',
			removeAction : '/hotel/removeFoodScheme',
		},
		{
			label : "Visible en web"
			,label_en : "Visible on web"
			,type : 'checkbox'
			,handle : 'visible'
		},
		{
			label : 'Permite reservar',
			label_en : 'Allow booking',
			type 	: 'checkbox',
			handle 	: 'active',
		}
	],
	locationRelacion : [
		{
			label : 'Relacionar con otra ciudad',
			label_en : 'Relate with another city',
			type : 'multi-select',
			object : 'locations',
			handle : 'locations'
		}
	],
	hotelLangs : [
		{
			label : 'Descripción Español',
			label_en : 'Spanish description',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripción Ingles',
			label_en : 'English description',
			type : 'textarea',
			handle : 'description_en',
		},
		{
			label : 'Descripción Ruso',
			label_en : 'Russian description',
			type : 'textarea',
			handle : 'description_ru',
		},
		{
			label : 'Descripción Portugués',
			label_en : 'Portuguese description',
			type : 'textarea',
			handle : 'description_pt',
		},
		{
			label : 'Servicios Español',
			label_en : 'Spanish services',
			type : 'textarea',
			handle : 'services_es',	
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios Inglés',
			label_en : 'English services',
			type : 'textarea',
			handle : 'services_en',	
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios Ruso',
			label_en : 'Russian services',
			type : 'textarea',
			handle : 'services_ru',	
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios Portugués',
			label_en : 'Portuguese services',
			type : 'textarea',
			handle : 'services_pt',	
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios con costo Español',
			label_en : 'Spanish cost service',
			type : 'textarea',
			handle : 'payed_services_es',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios con costo Inglés',
			label_en : 'English cost service',
			type : 'textarea',
			handle : 'payed_services_en',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios con costo Ruso',
			label_en : 'Russian cost services',
			type : 'textarea',
			handle : 'payed_services_ru',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios con costo Portugués',
			label_en : 'Portuguese cost service',
			type : 'textarea',
			handle : 'payed_services_pt',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		}
	],
	room : [
		{
			label : 'Nombre Español',
			label_en : 'Spanish name',
			type : 'text',
			handle : 'name_es',
			required : true,
		},
		{
			label : 'Nombre Inglés',
			label_en : 'English name',
			type : 'text',
			handle : 'name_en',
		},
		{
			label : 'Nombre Ruso',
			label_en : 'Ruso name',
			type : 'text',
			handle : 'name_ru',
		},
		{
			label : 'Nombre Portugués',
			label_en : 'Portuguese name',
			type : 'text',
			handle : 'name_pt',
		},
		{
			label : "Activo"
			,label_en : "Active"
			,type : 'checkbox'
			,handle : 'active'
		},
		{
			label : 'Vista',
			label_en : 'View',
			type : 'multi-select',
			handle : 'views',
			object : 'views',
			removeAction : '/hotel/removeView'
		},
		{
			label : 'Númer máximo de personas',
			label_en : 'People max number',
			type : 'text',
			handle : 'pax',
		},
		{
			label : 'Tarifa base',
			label_en : 'Base rate',
			type : 'money',
			handle : 'fee',
		},
		{
			label : 'Tarifa base(menores)',
			label_en : 'Base rate(children)',
			type : 'money',
			handle : 'feeChild',
		},
		{
			label : 'Tarifa por temporadas',
			label_en : 'Season rate',
			type : 'checkbox',
			handle : 'seasonal',
		},
	],
	roomDesc : [
		{
			label : 'Descripción Español',
			label_en : 'Spanish description',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripcion Inglés',
			label_en : 'English description',
			type : 'textarea',
			handle : 'description_en',
		},
		{
			label : 'Descripcion Ruso',
			label_en : 'Ruso description',
			type : 'textarea',
			handle : 'description_ru',
		},
		{
			label : 'Descripcion Portugués',
			label_en : 'Portuguese description',
			type : 'textarea',
			handle : 'description_pt',
		},
		{
			label : 'Servicios Español',
			label_en : 'Spanish services',
			type : 'textarea',
			handle : 'services_es',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Servicios Inglés',
			label_en : 'English services',
			type : 'textarea',
			handle : 'services_en',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
        {
            label : 'Servicios Ruso',
            label_en : 'Russian services',
            type : 'textarea',
            handle : 'services_ru',
            message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
        },
		{
			label : 'Servicios Portugués',
			label_en : 'Portuguese services',
			type : 'textarea',
			handle : 'services_pt',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
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
			label_en : 'Name',
			type : 'text',
			handle : 'title',
			required : true,
		},
		{
			label : 'Inicio',
			label_en : 'Start',
			type : 'date',
			handle : 'start',
			options : {
			    formatYear: 'yy',
			    startingDay: 1
			}
		},
		{
			label : 'Fin',
			label_en : 'End',
			type : 'date',
			handle : 'end',
		},
	],
	seasonScheme : [
		{
			label : 'Nombre',
			label_en : 'Name',
			type : 'text',
			handle : 'name',
			required : true,
		},	
	],
	tour : [
		{
			label : 'Nombre Español',
			label_en : 'Spanish name',
			type : 'text',
			handle : 'name',
			required : true,
		},
		{
			label : 'Máximo de clientes',
			label_en : 'Client max number',
			type : 'text',
			handle : 'pax',
		},
		{
			label : 'Tarifa adultos',
			label_en : 'Adult rate',
			type : 'money',
			handle : 'fee',
		},
		{
			label : 'Tarifa niños',
			label_en : 'Children rate',
			type : 'money',
			handle : 'feeChild',
		},
		/*{
			label : 'Horario General',
			label_en : 'General schedule',
			type : 'text',
			handle : 'schedule',
		},*/
		{
			label : 'Duración',
			label_en : 'Duration',
			type : 'text',
			handle : 'duration',
		},
		{
			label : 'Proveedor',
			label_en : 'LocationProvider',
			type : 'select',
			handle : 'provider',
			object : 'providers'
		},
		{
			label : 'Categorías',
			label_en : 'Categories',
			type : 'multi-select',
			handle : 'categories',
			object : 'tourcategories'
		},
		{
			label : 'Ubicación',
			label_en : 'Location',
			type : 'select',
			handle : 'location',
			object : 'locations'
		},
		{
			label : "¿Es visible en web?"
			,label_en : "It's visible on web?"
			,type : 'checkbox'
			,handle : 'visible'
		},
		{
			label : 'Esquema de Temporadas',
			label_en : 'Season schemes',
			type : 'select',
			handle : 'seasonScheme',
			object : 'schemes',
		},
		{
			label : '¿El traslado está incluido?',
			label_en : 'The transfer is included?',
			type : 'checkbox',
			handle : 'haveTranslate'
		},
	],
	tourforproviders : [
		{
			label : 'Nombre Español',
			label_en : 'Spanish name',
			type : 'text',
			handle : 'name',
			required : true,
		},
		{
			label : 'Máximo de clientes',
			label_en : 'Client max number',
			type : 'text',
			handle : 'pax',
		},
		{
			label : 'Tarifa adultos',
			label_en : 'Adult rate',
			type : 'money',
			handle : 'fee',
		},
		{
			label : 'Tarifa niños',
			label_en : 'Children rate',
			type : 'money',
			handle : 'feeChild',
		},
		{
			label : 'Horario General',
			label_en : 'General schedule',
			type : 'text',
			handle : 'schedule',
		},
		{
			label : 'Duración',
			label_en : 'Duration',
			type : 'text',
			handle : 'duration',
		},
		{
			label : 'Categorías',
			label_en : 'Categories',
			type : 'multi-select',
			handle : 'categories',
			object : 'tourcategories'
		},
		{
			label : 'Ubicación',
			label_en : 'Location',
			type : 'select',
			handle : 'location',
			object : 'locations'
		},
		{
			label : "Visible en web"
			,label_en : "Visible on web"
			,type : 'checkbox'
			,handle : 'visible'
		},
		{
			label : 'Traslado incluido',
			label : 'Transfer included',
			type : 'checkbox',
			handle : 'haveTranslate'
		},
	],
	tourLenguajes : [
		/*{
			label : 'Nombre Español',
			label_en : 'Spanish name',
			type : 'text',
			handle : 'name_es',
		},*/
		{
			label : 'Nombre Inglés',
			label_en : 'English name',
			type : 'text',
			handle : 'name_en',
		},
		{
			label : 'Nombre Ruso',
			label_en : 'Russian name',
			type : 'text',
			handle : 'name_ru',
		},
		{
			label : 'Nombre Portugués',
			label_en : 'Portuguese name',
			type : 'text',
			handle : 'name_pt',
		},
		{
			label : 'Descripción Español',
			label_en : 'Spanish description',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripción Inglés',
			label_en : 'English description',
			type : 'textarea',
			handle : 'description_en',
		},
		{
			label : 'Descripción Ruso',
			label_en : 'Russian description',
			type : 'textarea',
			handle : 'description_ru',
		},
		{
			label : 'Descripción Portugués',
			label_en : 'Portuguese description',
			type : 'textarea',
			handle : 'description_pt',
		},
		{
			label : 'Incluye Español',
			label_en : 'Spanish includes',
			type : 'textarea',
			handle : 'includes_es',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Incluye Inglés',
			label_en : 'English includes',
			type : 'textarea',
			handle : 'includes_en',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Incluye Ruso',
			label_en : 'Russian includes',
			type : 'textarea',
			handle : 'includes_ru',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Incluye Portugués',
			label_en : 'Portuguese includes',
			type : 'textarea',
			handle : 'includes_pt',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'No incluye Español',
			label_en : "Don't include Spanish",
			type : 'textarea',
			handle : 'does_not_include_es',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'No incluye Inglés',
			label_en : "Don't include English",
			type : 'textarea',
			handle : 'does_not_include_en',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'No incluye Rúso',
			label_en : "Don't include Russian",
			type : 'textarea',
			handle : 'does_not_include_ru',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'No incluye Portugués',
			label_en : "Don't include Portuguese",
			type : 'textarea',
			handle : 'does_not_include_pt',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Recomendaciones Español',
			label_en : 'Recommendations Spanish',
			type : 'textarea',
			handle : 'recommendations_es',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Recomendaciones Inglés',
			label_en : 'Recommendations English',
			type : 'textarea',
			handle : 'recommendations_en',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Recomendaciones Ruso',
			label_en : 'Recommendations Russian',
			type : 'textarea',
			handle : 'recommendations_ru',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
			label : 'Recomendaciones Portugués',
			label_en : 'Recommendations Portuguese',
			type : 'textarea',
			handle : 'recommendations_pt',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
	],
	tourcategory : [
		{
			label : 'Nombre'
			,label_en : 'Name'
			,type : 'text'
			,handle : 'name'
		}
		,{
			label : 'Nombre inglés'
			,label_en : 'English name'
			,type : 'text'
			,handle : 'name_en'
		}
		,{
			label : 'Nombre Ruso'
			,label_en : 'Russian name'
			,type : 'text'
			,handle : 'name_ru'
		}
		,{
			label : 'Nombre Portugués'
			,label_en : 'Portuguese name'
			,type : 'text'
			,handle : 'name_pt'
		}
	]
	,location : [
		{
			label : 'Nombre',
			label_en : 'Name',
			type : 'text',
			handle : 'name',
		},
		{
			label : 'Título URL',
			label_en : 'URL Title',
			type : 'text',
			handle : 'url_title'
		},
		{
			label : 'Código Postal',
			label_en : 'ZIP',
			type : 'text',
			handle : 'zipcode'
		},
		{
			label : 'País',
			label_en : 'Country',
			type : 'text',
			handle : 'country'
		}
	],
	locationTexts : [
		{
			label : 'Descripción Español',
			label_en : 'Spanish description',
			type : 'textarea',
			handle : 'description_es',
		},
		{
			label : 'Descripción Inglés',
			label_en : 'English description',
			type : 'textarea',
			handle : 'description_en',
		}
	],
	zoneBasic : [
		{
			label : 'Nombre Español',
			label_en : 'Spanish name',
			type : 'text',
			handle : 'name',
		},{
			label : 'Nombre Inglés',
			label_en : 'English name',
			type : 'text',
			handle : 'name_en',
		},{
			label : 'Código',
			label_en : 'Code',
			type : 'text',
			handle : 'code',
		},{
			label : 'Horas para Pickup',
			label_en : 'Pickup hours',
			type : 'text',
			handle : 'pickup_hrs',
		},
	],
	zoneComplement : [
		{
			label : 'Título Url',
			label_en : 'URL Title',
			type : 'text',
			handle : 'url_title',
		},{
			label : 'Descripción Español',
			label_en : 'Spanish description',
			type : 'textarea',
			handle : 'description_es',
		},{
			label : 'Descripción Inglés',
			label_en : 'English description',
			type : 'textarea',
			handle : 'description_en',
		}
	],
	transfer : [
		{
			label 	: 'Nombre Español',
			label_en : 'Spanish name',
			type 	: 'text',
			required: true,
			handle 	: 'name'
		},
		{
			label 	: 'Nombre Inglés',
			label_en : 'English name',
			type 	: 'text',
			required: false,
			handle 	: 'name_en'
		},
		/*{
			label 	: 'Precio viaje sencillo',
			label_en : 'One Way',
			type 	: 'text',
			required: true,
			handle 	: 'oneWay'
		},
		{
			label 	: 'Precio viaje redondo',
			label_en : 'Roundtrip',
			type 	: 'text',
			required: true,
			handle 	: 'roundTrip'
		},*/
		{
			label 	: 'Precio por hora',
			label_en : 'Price by hour',
			type 	: 'text',
			required: true,
			handle 	: 'priceByHr'
		},
		{
			label 	: 'Título URL',
			label_en : 'URL title',
			type 	: 'text',
			required: false,
			handle 	: 'url_title'
		},
		{
			label 	: 'Personas por servicio',
			label_en : 'People by service',
			type 	: 'text',
			required: false,
			handle 	: 'max_pax'
		},
		{
			label 	: 'Descripción Español',
			label_en : 'Spanish description',
			type 	: 'textarea',
			handle 	: 'description_es'
		},
		{
			label 	: 'Descripción Inglés',
			label_en : 'English description',
			type 	: 'textarea',
			handle 	: 'description_en'
		},
		{
			label 	: 'Descripción Portugués',
			label_en : 'Portuguese description',
			type 	: 'textarea',
			handle 	: 'description_pt'
		},
		{
			label 	: 'Descripción Ruso',
			label_en : 'Russian description',
			type 	: 'textarea',
			handle 	: 'description_ru'
		}
	],
	airport : [
		{
			label 	: 'Nombre',
			label_en : 'Name',
			type 	: 'text',
			handle 	: 'name',
			required : true,
		},{
			label 	: 'Nombre Inglés',
			label_en : 'English name',
			type 	: 'text',
			handle 	: 'name_es'
		},{
			label 	: 'Ciudad',
			label_en : 'City',
			type 	: 'select',
			handle 	: 'location',
			object 	: 'locations',
			on_Change : 'getZones',
			required : true,
		},{
			label 	: 'Zona',
			label_en : 'Zone',
			type 	: 'select',
			handle 	: 'zone',
			object 	: 'zones',
			required : true,
		},{
			label 	: 'Texto del Voucher Español',
			label_en : 'Spanish Voucher text',
			type 	: 'textarea',
			handle 	: 'voucher_text_es'
		},{
			label 	: 'Texto del Voucher Inglés',
			label_en : 'English Voucher text',
			type 	: 'textarea',
			handle 	: 'voucher_text_en'
		},
	],
	price : [
		{
			label 	: 'Región',
			label_en 	: 'Region',
			type 	: 'select',
			handle 	: 'zone',
			object 	: 'zones'
		},{
			label 	: 'Servicio',
			label_en : 'Service',
			type 	: 'select',
			handle 	: 'transfer',
			object 	: 'transfers'
		},{
			label 	: 'Aeropuerto',
			label_en : 'Airport',
			type 	: 'select',
			handle 	: 'airport',
			object 	: 'airports'
		},{
			label 	: 'Agencia',
			label_en : 'Agency',
			type 	: 'select',
			handle 	: 'company',
			object 	: 'companies'
		},{
			label 	: 'Sencillo',
			label_en : 'One way',
			type 	: 'text',
			handle 	: 'one_way_fee'
		},{
			label 	: 'Redondo',
			label_en : 'Round trip',
			type 	: 'text',
			handle 	: 'round_trip_fee'
		},{
			label 	: 'Activo',
			label_en : 'Active',
			type 	: 'checkbox',
			handle 	: 'active'
		}
	],
	company : [		
		{
			label : 'Nombre',
			label_en : 'Name',
			handle : 'name',
			type : 'text',
			required : true,
		},
		{
			label : 'Direccion',
			label_en : 'Address',
			handle : 'address',
			type : 'text',
			required : true,
			default: '',
		},
		{
			label : 'Código Postal',
			label_en : 'ZIP',
			handle : 'zipcode',
			type : 'text',
		},
		{
			label : 'Moneda Base',
			label_en : 'Base currency',
			type : 'select',
			handle : 'base_currency',
			object : 'currencies',
			required : true,
			default:'Pesos'
		},
		{
			label : 'Aplicaciones',
			label_en : 'Apps',
			type : 'multi-select',
			handle : 'apps',
			object : 'apps',
		},
		{
			label : 'Description',
			label_en : 'Description',
			handle : 'description',
			type : 'textarea',
		},
        {
            label : 'Terminos y condiciones',
            label_en : 'Terms and conditions',
            handle : 'terms',
            type : 'textarea-editor'
        },
        {
            label : 'Firma',
            label_en : 'Signature',
            handle : 'footer',
            type : 'textarea-editor'
        }
        /*,{
        	label : 'Tipo de cambio de venta'
        	,label_en : 'Sale exchange rate'
        	,handle : 'exchange_rate_sale'
        	,type : 'text'
        }
        ,{
        	label : 'Tipo de cambio contable'
        	,label_en : 'Book exchange rate'
        	,handle : 'exchange_rate_book'
        	,type : 'text'
        }*/
        ,{
        	label : 'Prepago'
        	,label_en : 'Prepaid'
        	,handle : 'prepaid'
        	,type : 'money'
        	,message : 'Monto de prepago que se da a la agencia'
        	,message_en : ''
        }
        ,{
        	label : 'Crédito'
        	,label_en : 'Credit'
        	,handle : 'credit'
        	,type : 'money'
        	,message : 'Monto de creédito que se da a la agencia'
        	,message_en : ''
        }
	],
    user : [
        {
            label : 'Nombre',
            label_en : 'Name',
            handle : 'name',
            type : 'text',
            required : true
        },
        {
            label : 'Apellido',
            label_en : 'Lastname',
            handle : 'last_name',
            type : 'text',
            required : true
        },
        {
            label : 'E-mail',
            label_en : 'Email',
            handle : 'email',
            type : 'text',
            required : true
        },
        {
            label : 'Teléfono',
            label_en : 'Phone',
            handle : 'phone',
            type : 'text'
        },
        {
            label : 'Activo',
            label_en : 'Active',
            handle : 'active',
            type : 'checkbox'
        }
    ],
    clientForOrders : [
    	{
            label : 'Nombre',
            label_en : 'Name',
            handle : 'name',
            type : 'text',
            required : true
        },
        {
            label : 'Teléfono',
            label_en : 'Phone',
            handle : 'phone',
            type : 'text',
            required : true
        },
        {
            label : 'E-mail',
            label_en : 'Email',
            handle : 'email',
            type : 'text',
            required : true
        },
    ]
    ,client : [
        {
            label : 'Nombre',
            label_en : 'Name',
            handle : 'name',
            type : 'text',
            required : true
        },
        {
            label : 'Direccion',
            label_en : 'Address',
            handle : 'address',
            type : 'text'
        },
        {
            label : 'RFC',
            label_en : 'RFC',
            handle : 'rfc',
            type : 'text',
            required : true
        },
        {
            label : 'Teléfono',
            label_en : 'Phone',
            handle : 'phone',
            type : 'text',
            required : true
        },
        {
            label : 'E-mail',
            label_en : 'Email',
            handle : 'email',
            type : 'text',
            required : true
        },
        {
            label : 'Ciudad',
            label_en : 'City',
            handle : 'city',
            type : 'text'
        },
        {
            label : 'Estado',
            label_en : 'State',
            handle : 'state',
            type : 'text'
        },
        {
            label : 'Pais',
            label_en : 'Country',
            handle : 'country',
            type : 'text'
        },
        {
            label : 'Comentarios',
            label_en : 'Comments',
            handle : 'comments',
            type : 'textarea'
        }
    ],
    client_contact : [
        {
            label : 'Nombre',
            label_en : 'Name',
            handle : 'name',
            type : 'text'
        },
        {
            label : 'Teléfono',
            label_en : 'Phone',
            handle : "phone",
            type : 'text'
        },
        {
            label : 'Extensión',
            label_en : 'Extension',
            handle : 'phone_extension',
            type : 'text'
        },
        {
            label : 'E-mail',
            label_en : 'Email',
            handle : 'email',
            type : 'text'
        },
        {
            label : "Tipo",
            label_en : 'Type',
            handle : "type",
            type : 'select',
            object : 'contact_types'
        },
        {
            label : 'Puesto',
            label_en : 'Job position',
            handle : 'work_position',
            type : 'text'
        }
    ],
    client_ct : [
        {
            label : 'Nombre',
            label_en : 'Name',
            handle : 'name',
            type : 'text'
        },
        {
            label : 'Teléfono',
            label_en : 'Telefono',
            handle : "phone",
            type : 'text'
        },
        {
            label : 'E-mail',
            label_en : 'E-mail',
            handle : 'email',
            type : 'text'
        },
    ],
    company_tax : [
        {
            label : 'Nombre',
            label_en : 'Name',
            handle : 'name',
            type : 'text'

        },
        {
            label : 'Impuesto %',
            label_en : 'Tax %',
            handle : 'value',
            type : 'text'
        }
    ],
    packages : [
    	{
    		label : 'Nombre Español',
    		label_en : 'Spanish name',
    		handle : 'name',
    		required: true,
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		label_en : 'English name',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		label_en : 'Russian name',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		label_en : 'Portuguese name',
    		handle : 'name_pt',
    		type : 'text'
    	},
    	{
    		label : 'Número de días',
    		label_en : 'Days number',
    		handle : 'numer_days',
    		type : 'text'
    	},
    	{
    		label : 'Número de noches',
    		label_en : 'Night number',
    		handle : 'numer_night',
    		type : 'text'
    	},
    	{
			label : "¿Es visible en web?"
			,label_en : "It's Visible on web?"
			,type : 'checkbox'
			,handle : 'visible'
		},
    	{
    		label : 'Descripción Español',
    		label_en : 'Spanish description',
    		handle : 'description_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Inglés',
    		label_en : 'English description',
    		handle : 'description_en',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Ruso',
    		label_en : 'Russian description',
    		handle : 'description_ru',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Portugués',
    		label_en : 'Portuguese description',
    		handle : 'description_pt',
    		type : 'textarea'
    	},
    	{
    		label : 'Incluye Español',
    		label_en : 'Spanish includes',
    		handle : 'includes_es',
    		type : 'textarea',
    		message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
    	},
    	{
    		label : 'Incluye Inglés',
    		label_en : 'English includes',
    		handle : 'includes_en',
    		type : 'textarea',
    		message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
    	},
    	{
            label : 'Incluye Ruso',
            label_en : 'Russian includes',
            type : 'textarea',
            handle : 'includes_ru',
            message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
        },
		{
			label : 'Incluye Portugués',
			label_en : 'Portuguese includes',
			type : 'textarea',
			handle : 'includes_pt',
			message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
		},
		{
            label : 'No incluye Español',
            label_en : "Spanish Don't include",
            type : 'textarea',
            handle : 'does_not_include_es',
            message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
        },
        {
            label : 'No incluye Inglés',
            label_en : "English Don't include",
            type : 'textarea',
            handle : 'does_not_include_en',
            message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
        },
        {
            label : 'No incluye Ruso',
            label_en : "Russian Don't include",
            type : 'textarea',
            handle : 'does_not_include_ru',
            message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
        },
        {
            label : 'No incluye Portugués',
            label_en : "Portuguese Don't include",
            type : 'textarea',
            handle : 'does_not_include_pt',
            message : "Separar por enter, cada línea es un elemento de lista",
			message_en : "Separate with enter, each line is an list element",
        },
    ],
    packageHotel : [
    	{
    		label : 'Categoria',
    		label_en : 'Category',
    		type : 'select',
			handle : 'category',
			object : 'categories',
    	},
    	{
    		label : 'Nombre Español',
    		label_en : 'Spanish name',
    		handle : 'name_es',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		label_en : 'English name',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		label_en : 'Russian name',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		label_en : 'Portuguese name',
    		handle : 'name_pt',
    		type : 'text'
    	},
    	{
    		label : 'Descripción Español',
    		label_en : 'Spanish description',
    		handle : 'description_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Inglés',
    		label_en : 'English description',
    		handle : 'description_en',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Ruso',
    		label_en : 'Russian description',
    		handle : 'description_ru',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Portugués',
    		label_en : 'Portuguese description',
    		handle : 'description_pt',
    		type : 'textarea'
    	}
    ],
    packageDay : [
    	{
    		label : 'Día',
    		label_en : 'Day',
    		handle : 'day',
    		type : 'select-num',
    		required : true,
    		object : 'daysnumber'
    	},
    	{
    		label : 'Lugares',
    		label_en : 'Places',
    		handle : 'locations',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Español',
    		label_en : 'Spanish name',
    		handle : 'name_es',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		label_en : 'English name',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		label_en : 'Russian name',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		label_en : 'Portuguese name',
    		handle : 'name_pt',
    		type : 'text'
    	},
    	{
    		label : 'Descripción Español',
    		label_en : 'Spanish description',
    		handle : 'description_es',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Inglés',
    		label_en : 'English description',
    		handle : 'description_en',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Ruso',
    		label_en : 'Russian description',
    		handle : 'description_ru',
    		type : 'textarea'
    	},
    	{
    		label : 'Descripción Portugués',
    		label_en : 'Portuguese description',
    		handle : 'description_pt',
    		type : 'textarea'
    	}
    ],
    packageDayBasic : [
    	{
    		label : 'Nombre Español',
    		label_en : 'Spanish name',
    		handle : 'name_es',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Inglés',
    		label_en : 'English name',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Día',
    		label_en : 'Day',
    		handle : 'day',
    		type : 'select-num',
    		required : true,
    		object : 'daysnumber'
    	}
    ],
    hotelRoomView : [
    	{
    		label : 'Nombre',
    		label_en : 'Name',
    		handle : 'name',
    		type : 'text',
    		required : true,
    	},
    	{
    		label : 'Nombre Inglés',
    		label_en : 'English name',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		label_en : 'Russian name',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		label_en : 'Portuguese name',
    		handle : 'name_pt',
    		type : 'text'
    	}
    ],
    foodschemes : [
    	{
    		label : 'Nombre',
    		label_en : 'Name',
    		handle : 'name',
    		type : 'text',
    		required : true,
    	},
    	{
    		label : 'Nombre Inglés',
    		label_en : 'English name',
    		handle : 'name_en',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Ruso',
    		label_en : 'Russian name',
    		handle : 'name_ru',
    		type : 'text'
    	},
    	{
    		label : 'Nombre Portugués',
    		label_en : 'Portuguese name',
    		handle : 'name_pt',
    		type : 'text'
    	}
    ],
    cupons : [
    	{
			label : 'Nombre',
			label_en : 'Name',
			type : 'text',
			handle : 'name',
			required : true,
		},
		{
			label : 'Días de duración',
			label_en : 'Duration days',
			type : 'text',
			handle : 'days',
		},
		{
			label : 'Hoteles',
			label_en : 'Hotels',
			type : 'multi-select',
			handle : 'hotels',
			object : 'hotels',
			//removeAction : '/hotel/removeFoodScheme',
			removeAction:'/cupon/removeHotel'
		},
		{
			label : 'Tours',
			label_en : 'Tours',
			type : 'multi-select',
			handle : 'tours',
			object : 'tours',
			//removeAction : '/hotel/removeFoodScheme',
			removeAction:'/cupon/removeTour'
		},
		{
			label : 'Servicios',
			label_en : 'Services',
			type : 'multi-select',
			handle : 'transfers',
			object : 'transfers',
			//removeAction : '/hotel/removeFoodScheme',
			removeAction:'/cupon/removeTransfer'
		}
    ],
	cuponsadvance : [
		{
			label : 'Descuento viaje sencillo',
			label_en : 'One way discount',
			type : 'text',
			handle : 'simple_discount',
		},
		{
			label : 'Descuento viaje redondo',
			label_en : 'Round trip discount',
			type : 'text',
			handle : 'round_discount',
		},
		{
			label : 'Numero máximo de pasajeros',
			label_en : 'People max number',
			type : 'text',
			handle : 'max_pax',
		},
		{
			label : 'Viaje redondo',
			label_en : 'Round trip',
			type : 'checkbox',
			handle : 'round',
		},
		{
			label : 'Viaje simple',
			label_en : 'One way',
			type : 'checkbox',
			handle : 'simple',
		},
		{
			label : 'Comienza en aeropuerto',
			label_en : 'Start at airport',
			type : 'checkbox',
			handle : 'airport',
		},
		{
			label : 'Comienza en hotel',
			label_en : 'Start at hotel',
			type : 'checkbox',
			handle : 'hotel',
		},
		{
			label : 'Perpetuo',
			label_en : 'Perpetual',
			type : 'checkbox',
			handle : 'perpetuo',
		}

	],
	cuponSingle : [
		{
			label : 'Tipo',
			label_en : 'Type',
			type : 'text',
			handle : 'name',
		},
		{
			label : 'Fecha de expiración',
			label_en : 'Expiration date',
			type : 'date',
			handle : 'expiration',
			options : {
			    formatYear: 'yy',
			    startingDay: 1
			}
		},
		{
			label : 'token',
			label_en : 'token',
			type : 'text',
			handle : 'token',
			on_Change : 'validateToken'
		},
		{
			label : 'Multiple',
			label_en : 'Multiple',
			type : 'checkbox',
			handle : 'multiple',
		},
		{
			label : 'Descripción',
			label_en : 'Description',
			type : 'text',
			handle : 'description',
		},
	],
	cuponSingleEdit : [
		{
			label : 'Tipo',
			label_en : 'Type',
			type : 'select',
			handle : 'cupon',
			object : 'cupon',
			required : true,
		},
		{
			label : 'Fecha de expiración',
			label_en : 'Expiration date',
			type : 'date',
			handle : 'expiration',
			options : {
			    formatYear: 'yy',
			    startingDay: 1
			},
			required:true
		},
		{
			label : 'token',
			label_en : 'token',
			type : 'text',
			handle : 'token',
			on_Change : 'validateToken'
		},
		{
			label : 'Multiple',
			label_en : 'Multiple',
			type : 'checkbox',
			handle : 'multiple',
		},
		{
			label : 'Descripcion',
			label_en : 'Description',
			type : 'text',
			handle : 'description',
		},

	],
	claims : [
		{
			label : 'Tipo de queja'
			,label_en : 'Claim type'
			,type : 'select'
			,handle : 'type'
			,object : 'claimtypes'
		},
		{
			label : 'Queja'
			,label_en : 'Claim text'
			,type : 'textarea'
			,handle : 'claim_text'
		},
		{
			label : 'Operador'
			,label_en : 'Driver'
			,type : 'text'
			,handle : 'driver'
		},
		{
			label : 'Respuesta al cliente'
			,label_en : 'Answer to client'
			,type : 'textarea'
			,handle : 'answer'
		},
		{
			label : 'Informar a customer service'
			,label_en : 'Inform customer services'
			,type : 'checkbox'
			,handle : 'informCS'
		}
	],
	claimResolve : [
		{
			label : 'Departamento'
			,label_en : 'Department'
			,type : 'text'
			,handle : 'department'
		},
		{
			label : 'Seguimiento'
			,label_en : 'Follow up'
			,type : 'textarea'
			,handle : 'followup'
		},
		{
			label : 'Fecha de resolución'
			,label_en : 'Resolve date'
			,type : 'date'
			,handle : 'end_date'
		}
	],
	lostandfound : [
		{
			label : 'Objetos'
			,label_en : 'Objects'
			,type : 'textarea'
			,handle : 'objects'
		},
		{
			label : 'Respuesta al cliente'
			,label_en : 'Answer to client'
			,type : 'textarea'
			,handle : 'answer'
		},
		{
			label : 'Respuesta depto. operaciones'
			,label_en : 'Answer operations department'
			,type : 'textarea'
			,handle : 'base_answer'
		},
		{
			label : 'Encontrado'
			,label_en : 'Found'
			,type : 'checkbox'
			,handle : 'found'
		}
	]
	,tourprovider : [
		{
			label : 'Nombre'
			,label_en : 'Name'
			,type : 'text'
			,handle : 'name'
			,required : true
		}
		,{
			label: 'Dirección'
			,label_en : 'Address'
			,type : 'text'
			,handle : 'address'
		}
		,{
			label : 'Ciudad'
			,label_en : 'City'
			,type : 'select'
			,handle : 'location'
			,object : 'locations'
		}
		,{
			label : 'País'
			,label_en : 'Country'
			,type : 'text'
			,handle : 'country'
		}
		,{
			label : '¿Proporciona crédito?'
			,label_en : 'Credit admited?'
			,type : 'checkbox'
			,handle : 'isCredit'
		}
		,{
			label : 'Tipo de cambio'
			,label_en : 'Exchange rate'
			,type : 'text'
			,handle : 'exchange_rate'
		}
		,{
			label : 'Moneda base'
			,label_en : 'Base currency'
			,type : 'select'
			,object : 'currencies'
			,handle : 'base_currency'
		}
	]
	, airline : [
		{
			label : 'Nombre'
			,label_en : 'Name'
			,type : 'text'
			,handle : 'name'
			,required : true
		}
		,{
			label : 'Nombre en Inglés'
			,label_en : 'English name'
			,type : 'text'
			,handle : 'name_en'
			,required : true
		}
		,{
			label : 'Nombre Portugués'
			,label_en : 'Portuguese name'
			,type : 'text'
			,handle : 'name_pt'
			,required : true
		}
		,{
			label : 'Nombre Ruso'
			,label_en : 'Russian name'
			,type : 'text'
			,handle : 'name_ru'
			,required : true
		}
	]
};
