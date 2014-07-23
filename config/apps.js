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
			'/sale/' : {
				label : 'ventas',
				icon : 'fa-briefcase'
			},
			'/quote/' : {
				label : 'Cotizaciones',
				icon : 'fa-file'
			},

			'/product/' : {
				label : 'Productos',
				icon : 'fa-cube'
			},
			'/product_type/' : {
				label : 'Categorias',
				icon : 'fa-archive'
			}
		},
	},
};
