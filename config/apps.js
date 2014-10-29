module.exports.apps = {
	system : {
        name : 'system',
		label : 'Sistema',
		icon : 'fa-gear',
		views : {
			'/company/' : {
				label : 'Empresas',
				icon : 'fa-building',
                permission : 'viewCompanies'
			},
			'/admin/currencies/' : {
				label : 'Mondedas',
				icon : 'fa-money',
                permission : 'viewCurrencies'
			},
			'/user/' : {
				label : 'Usuarios',
				icon : 'fa-users',
                permission : 'viewUser'
			}
		},
        permissions : [
            { label : 'ver companias',handle : 'viewCompanies'},
            { label : 'ver monedas',handle : 'viewCurrencies'},
            { label : 'ver usuarios',handle : 'viewUser'}
        ]
	},
	products : {
        name : 'products',
		label : 'Ventas',
		icon : 'fa-briefcase',
		views : {
			'/ventas/' : {
				label : 'Ventas',
				icon : 'fa-briefcase',
                permission : 'viewSales'
			},
            '/salesQuote/':{
                label:'Cotizaciones',
                icon:'fa-database',
                permission : 'viewSaleQuotes'

            },
			'/product/' : {
				label : 'Productos',
				icon : 'fa-cube',
                permission : 'viewProduct'
			},
			'/product_type/' : {
				label : 'Categorias',
				icon : 'fa-cubes',
                permission : 'viewProductType'
			},
            '/machine/':{
                label:'Impresoras',
                icon:'fa-gears',
                permission : 'viewMachine'
            },
            '/installation/':{
                label:'Instalaciones',
                icon:'fa-wrench',
                permission : 'viewInstallation'
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
	},
    clients : {
        name : 'clients',
        label : 'Clientes',
        icon : 'fa-users',
        views : {
            '/clientes/' : {
                label : 'Buscar',
                icon : 'fa-user',
                permission : 'viewClients'
            }
        },
        permissions : [
            {label : 'ver clientes',handle : 'viewClients'},
            {label : 'editar clientes',handle : 'editClients'},
            {label : 'editar contactos de clientes',handle : 'editClientContact'}
        ]
    }
    //sorry erick
//    ,hotels : {
//        name : 'hotels',
//    	label : 'Hoteles',
//        icon : 'fa-building',
//        views : {
//            '/hotel/' : {
//                label : 'Hoteles',
//                icon : 'fa-building-o'
//            }
//        }
//    }
};
