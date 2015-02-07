module.exports.apps = [
	/* system */
    {
        name : 'system',
		label : 'Sistema',
		icon : 'fa-gear',
		actions : [
			{
				label : 'Empresas',
				icon : 'fa-building',
                url : '/company/',
                handle : 'empresas',
                showInMenu : true,
                controller : 'company'
			},
			/*'/admin/currencies/' : {
				label : 'Mondedas',
				icon : 'fa-money',
			},*/
			{
				label : 'Usuarios',
				icon : 'fa-users',
                url : '/user/',
                handle : 'usuarios',
                showInMenu : true,
                controller : 'user',
                action : 'index'
			},
            {
                label : 'Monedas',
                icon : 'fa-money',
                url : '/admin/currencies',
                handle : 'currencies',
                showInMenu : true,
                controller : 'admin',
                action : 'currencies'
            },
            {
                label : 'Precios',
                icon : 'fa-money',
                url : '/transferprice/',
                showInMenu : true,
                controller : 'transferprice',
                action : 'index'
            }
		]
	},
	/* products */
    {
        name : 'products',
		label : 'Ventas',
		icon : 'fa-briefcase',
        actions : [
//			{
//				label : 'Ventas',
//				icon : 'fa-briefcase',
//                url : '/ventas/',
//                handle : 'ventas',
//                showInMenu : true,
//                controller : 'sale',
//                action : 'index'
//			},
            {
                label:'Cotizaciones',
                icon:'fa-database',
                url : '/salesQuote/',
                handle : 'cotizaciones',
                showInMenu : true,
                controller : 'salesQuote',
                action : 'index'
            },
            {
                label:'Ordenes de trabajo',
                icon:'fa-wrench',
                url : '/saleWorkOrder/',
                handle : 'ordenes',
                showInMenu : true,
                controller : 'salesWorkOrder',
                action : 'index'
            },
			{
				label : 'Productos',
				icon : 'fa-cube',
                url : '/product/',
                handle : 'productos',
                showInMenu : true,
                controller : 'product',
                action : 'index'
			},
			{
				label : 'Categorias',
				icon : 'fa-cubes',
                url : '/product_type/',
                handle : 'categorias',
                showInMenu : true,
                controller : 'product_type',
                action : 'index'
			},
            {
                label:'Maquinas',
                icon:'fa-gears',
                url : '/machine/',
                handle : 'maquinas',
                showInMenu : true,
                controller : 'machine',
                action : 'index'
            },
            {
                label:'Instalaciones',
                icon:'fa-wrench',
                url : '/installation/',
                handle : 'instalaciones',
                showInMenu : true,
                controller : 'installation',
                action : 'index'
            }
		]
	},
    /* clients */
    {
        name : 'clients',
        label : 'Clientes',
        icon : 'fa-users',
        actions : [
            {
                label: 'Buscar',
                icon: 'fa-user',
                url: '/clientes/',
                handle: 'clientes',
                showInMenu: true,
                controller : 'client',
                action : 'index'
            }
        ]
    },
    /* hotels */
    {
        name : 'hotels',
        label : 'Hoteles/Aeropuertos',
        icon : 'fa-building',
        actions : [
            {
                label : 'Hoteles',
                icon : 'fa-building-o',
                url : '/hotel/',
                handle : 'hoteles',
                showInMenu : true,
                controller : 'hotel',
                action : 'index'
            },
            {
                label : 'Aeropuertos',
                icon : 'fa-plane',
                url : '/airport/',
                handle : 'airports',
                showInMenu : true,
                controller : 'airport',
                action : 'index'
            },
            {
                label : 'Temporadas',
                icon : 'fa-sun-o',
                url : '/season/',
                handle : 'temporadas',
                showInMenu : true,
                controller : 'season',
                action : 'index'
            },
        ],
    },
    /* locations */
    {
        name    : 'locations',
        label   : 'Ciudades',
        icon    : 'fa-flag',
        actions   : [
            {
                label   : 'Ciudades',
                icon    : 'fa-flag',
                url : '/location/',
                handle : 'ciudades',
                showInMenu : true,
                controller : 'location',
                action : 'index'

            }
        ]
    },
    /* transfers */
    {
        name : 'transfers',
        label : 'Servicios',
        icon : 'fa-clipboard',
        actions : [
            {
                label : 'Reservaciones',
                icon : 'fa-car',
                url : '/order/',
                handle : 'orders',
                showInMenu : true,
                controller : 'order',
                action : 'index'
            },
            {
                label : 'Tours',
                icon : 'fa-compass',
                url : '/tour/',
                handle : 'tours',
                showInMenu : true,
                controller : 'tour',
                action : 'index'
            },
            {
                label : 'Traslados',
                icon : 'fa-car',
                url : '/transfer/',
                handle : 'transfer',
                showInMenu : true,
                controller : 'transfer',
                action : 'index'
            },
            {
                label : 'Paquetes',
                icon : 'fa-dropbox',
                url : '/packagetour/',
                handle : 'packagetour',
                showInMenu : true,
                controller : 'packagetour',
                action : 'index'
            },
            {
                label : 'Cupones',
                icon : 'fa-ticket',
                url : '/cupon/',
                showInMenu : true
            },
            {
                label : 'Instancias cupones',
                icon : 'fa-ticket',
                url : '/cupon/',
                showInMenu : true
            },
            /*'/transfer/' : {
                label : 'Translados',
                icon : 'fa-cab'
            },*/
        ]
    }
];
