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
			object : 'locations'
		},
		{
			label : 'Población',
			type : 'select',
			handle : 'location',
			object : 'locations',
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
			label : 'Ubicacion',
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
			type : 'text',
			handle : 'description_es',
		},
		{
			label : 'Descripción Inglés',
			type : 'text',
			handle : 'description_en',
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
	]
};
