module.exports.apps = {
	system : {
        name : 'system',
		label : 'Sistema',
		icon : 'fa-gear',
		views : {
			'/company/' : {
				label : 'Empresas',
				icon : 'fa-building',
			},
			'/admin/currencies/' : {
				label : 'Mondedas',
				icon : 'fa-money',
			},
			'/user/' : {
				label : 'Usuarios',
				icon : 'fa-users',
			}
		},
	},
	/*products : {
        name : 'products',
		label : 'Ventas',
		icon : 'fa-briefcase',
		views : {
			'/ventas/' : {
				label : 'Ventas',
				icon : 'fa-briefcase',
			},
            '/salesQuote/':{
                label:'Cotizaciones',
                icon:'fa-database',

            },
			'/product/' : {
				label : 'Productos',
				icon : 'fa-cube',
			},
			'/product_type/' : {
				label : 'Categorias',
				icon : 'fa-cubes',
			},
            '/machine/':{
                label:'Impresoras',
                icon:'fa-gears',
            },
            '/installation/':{
                label:'Instalaciones',
                icon:'fa-wrench',
            }
		},
        permissions : [
            {label : 'ver ventas',handle : 'viewSales'},
            {label : 'vet cotizaciones',handle : 'viewSaleQuotes'},
            {label : 'ver productos',handle : 'viewProduct'},
            {label : 'ver categorias de producto',handle : 'viewProductType'},
            {label : 'ver impresoras',handle : 'viewMachine'},
            {label : 'ver instalaciones',handle : 'viewInstallation'}
        ]
	},*/
    clients : {
        name : 'clients',
        label : 'Clientes',
        icon : 'fa-users',
        views : {
            '/clientes/' : {
                label : 'Buscar',
                icon : 'fa-user',
            }
        },
        permissions : [
            {label : 'ver clientes',handle : 'viewClients'},
            {label : 'editar clientes',handle : 'editClients'},
            {label : 'editar contactos de clientes',handle : 'editClientContact'}
        ]
    },
    hotels : {
        name : 'hotels',
        label : 'Hoteles',
        icon : 'fa-building',
        views : {
            '/hotel/' : {
                label : 'Hoteles',
                icon : 'fa-building-o'
            },
            '/season/' : {
                label : 'Temporadas',
                icon : 'fa-sun-o'
            },
        },
    },
    ciudades : {
        name    : 'locations',
        label   : 'Ciudades',
        icon    : 'fa-flag',
        views   : {
            '/location/' : {
                label   : 'Ciudades',
                icon    : 'fa-flag'
            }
        }
    },
    services : {
        name : 'services',
        label : 'Servicios',
        icon : 'fa-clipboard',
        views : {
            '/tour/' : {
                label : 'tours',
                icon : 'fa-compass'
            },
            '/transfer/' : {
                label : 'Translados',
                icon : 'fa-cab'
            },
        },
    },
    hotels : {
        name : 'hotels',
    	label : 'Hoteles',
        icon : 'fa-building',
        views : {
            '/hotel/' : {
                label : 'Hoteles',
                icon : 'fa-building-o'
            }
        }
    }
};
