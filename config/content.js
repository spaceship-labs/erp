module.exports.content = {
	hotel : [
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
			type : 'text',
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
			handle : 'name',
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
};
