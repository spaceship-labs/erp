module.exports.apps = {
	system : {
		label : 'Sistema',
		icon : 'fa-gear',
		views : {
			'/company/' : {
				label : 'Empresas',
				icon : 'fa-building'
			},
			'/company/currencies/' : {
				label : 'Mondedas',
				icon : 'fa-money'
			},
			'/user/' : {
				label : 'Usuarios',
				icon : 'fa-users'
			}
		},
	},
	products : {
		label : 'Ventas',
		icon : 'fa-briefcase',
		views : {
			'/ventas/' : {
				label : 'ventas',
				icon : 'fa-briefcase'
			},
			'/cotizaciones/' : {
				label : 'Cotizaciones',
				icon : 'fa-file'
			},

			'/productos/' : {
				label : 'Productos',
				icon : 'fa-truck'
			},
		},
	},
};
