module.exports.apps = {
	system : {
		label : 'Sistema',
		icon : 'fa-gear',
		views : {
			'/company/' : {
				label : 'Empresas',
				icon : 'fa-building'
			},
			'/admin/currencies/' : {
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
				label : 'Ventas',
				icon : 'fa-briefcase'
			},
            '/salesQuote/':{
                label:'Cotizaciones',
                icon:'fa-database'

            },
			'/product/' : {
				label : 'Productos',
				icon : 'fa-cubes'
			},
			'/product_type/' : {
				label : 'Categorias',
				icon : 'fa-archive'
			},
            '/machine/':{
                label:'Maquinas',
                icon:'fa-gears'

            }
		},
	},
    clients : {
        label : 'Clientes',
        icon : 'fa-users',
        views : {
            '/clientes/' : {
                label : 'Buscar',
                icon : 'fa-user'
            }
        },
    },
};
