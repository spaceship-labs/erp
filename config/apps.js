module.exports.apps = [
	/* system */
    {
        name : 'system',
		label : 'Sistema',
        label_en : 'System',
		icon : 'fa-gear',
		actions : [
			{
				label : 'Empresas',
                label_en : 'Companies',
				icon : 'fa-building',
                url : '/company/',
                handle : 'empresas',
                showInMenu : true,
                controller : 'company'
			},
			{
                label : 'Usuarios',
				label_en : 'Users',
				icon : 'fa-users',
                url : '/user/',
                handle : 'usuarios',
                showInMenu : true,
                controller : 'user',
                action : 'index'
			},
            {
                label : 'Monedas',
                label_en : 'Currencies',
                icon : 'fa-usd',
                url : '/admin/currencies',
                handle : 'currencies',
                showInMenu : true,
                controller : 'admin',
                action : 'currencies'
            },
            {
                label : 'Precios de traslados',
                label_en : 'Transfers Prices',
                icon : 'fa-money',
                url : '/transferprice/',
                showInMenu : true,
                controller : 'transferprice',
                action : 'index'
            },
            {
                label : 'Unidades',
                label_en : 'Unities',
                icon : 'fa-bus',
                url : '/unity/',
                showInMenu : true,
                controller : 'unity',
                action : 'index'
            },
            {
                label : 'Tipos de unidad',
                label_en : 'Unity types',
                icon : 'fa-th-list',
                url : '/unitytype/',
                showInMenu : true,
                controller : 'unitytype',
                action : 'index'
            }
		]
	},
	/* products */
    {
        name : 'products',
		label : 'Ventas',
        label_en : 'Sales',
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
                label_en : 'Quotes',
                icon:'fa-database',
                url : '/salesQuote/',
                handle : 'cotizaciones',
                showInMenu : true,
                controller : 'salesQuote',
                action : 'index'
            },
            {
                label:'Ordenes de trabajo',
                label_en : 'Orders',
                icon:'fa-barcode',
                url : '/saleOrder/',
                handle : 'ordenes',
                showInMenu : true,
                controller : 'saleOrder',
                action : 'index'
            },
			{
				label : 'Productos',
                label_en : 'Products',
				icon : 'fa-cube',
                url : '/product/',
                handle : 'productos',
                showInMenu : true,
                controller : 'product',
                action : 'index'
			},
			{
				label : 'Categorías',
                label_en : 'Categories',
				icon : 'fa-cubes',
                url : '/product_type/',
                handle : 'categorias',
                showInMenu : true,
                controller : 'product_type',
                action : 'index'
			},
            {
                label:'Máquinas',
                label_en : 'Machines',
                icon:'fa-gears',
                url : '/machine/',
                handle : 'maquinas',
                showInMenu : true,
                controller : 'machine',
                action : 'index'
            },
            {
                label:'Instalaciones',
                label_en : 'Setting-up',
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
        label_en : 'Clients',
        icon : 'fa-users',
        url: '/clientes/',
        handle: 'clientes',
        notDropdown : true
    },
    /* hotels */
    {
        name : 'hotels',
        label : 'Ciudades y Hoteles',
        label_en : 'Cities and Hotels',
        icon : 'fa-building',
        actions : [
            {
                label   : 'Ciudades',
                label_en : 'Cities',
                icon    : 'fa-flag',
                url : '/location/',
                handle : 'ciudades',
                showInMenu : true,
                controller : 'location',
                action : 'index'
            }
            ,{
                label : 'Aeropuertos',
                label_en : 'Airports',
                icon : 'fa-plane',
                url : '/airport/',
                handle : 'airports',
                showInMenu : true,
                controller : 'airport',
                action : 'index'
            }
            ,{
                label : 'Hoteles',
                label_en : 'Hotels',
                icon : 'fa-building-o',
                url : '/hotel/',
                handle : 'hoteles',
                showInMenu : true,
                controller : 'hotel',
                action : 'index'
            }
            ,{
                label : 'Temporadas',
                label_en : 'Seasons',
                icon : 'fa-sun-o',
                url : '/seasonScheme/',
                handle : 'temporadas',
                showInMenu : true,
                controller : 'seasonScheme',
                action : 'index'
            }
            ,{
                label : 'Aerolineas',
                label_en : 'Airlines',
                icon : 'fa-plane',
                url : '/airline/',
                handle : 'airline',
                showInMenu : true,
                controller : 'airline',
                action : 'index'
            }
            ,{
                label : 'Vistas de cuarto',
                label_en : 'Rooms views',
                icon : 'fa-eye',
                url : '/hotelroomview/',
                handle : 'hotelroomview',
                showInMenu : true,
                controller : 'hotelroomview',
                action : 'index'
            }
            ,{
                label : 'Esquemas de alimentación',
                label_en : 'Food schemes',
                icon : 'fa-cutlery',
                url : '/foodscheme/',
                handle : 'foodscheme',
                showInMenu : true,
                controller : 'foodscheme',
                action : 'index'
            }
        ]
    },
    /* Circuitos */
    {
        name    : 'circuits',
        label   : 'Circuitos',
        label_en : 'Circuits',
        icon    : 'fa-dropbox',
        url : '/packagetour/',
        handle : 'packagetour',
        controller : 'packagetour',
        action : 'index',
        notDropdown : true
    },
    {
        name        : 'tours'
        ,label      : 'Tours'
        ,label_en   : 'Tours'
        ,icon       : 'fa-compass'
        ,actions    : [
            {
                label : 'Tours',
                label_en : 'Tours',
                icon : 'fa-compass',
                url : '/tour/',
                handle : 'tours',
                showInMenu : true,
                controller : 'tour',
                action : 'index'
            }
            ,{
                label : 'Proveedores de Tours',
                label_en : 'Tours Providers',
                icon : 'fa-compass',
                url : '/tourprovider/',
                handle : 'toursprovider',
                showInMenu : true,
                controller : 'tourprovider',
                action : 'index'
            }
            ,{
                label : 'Categorías de Tours',
                label_en : 'Tours Categories',
                icon : 'fa-folder',
                url : '/tourcategory/',
                handle : 'tourcategory',
                showInMenu : true,
                controller : 'tourcategory',
                action : 'index'
            }
        ]
    },
    /* transfers */
    {
        name : 'transfers',
        label : 'Servicios',
        label_en : 'Services',
        icon : 'fa-clipboard',
        actions : [
            {
                label : 'Traslados',
                label_en : 'Transfers',
                icon : 'fa-road',
                url : '/transfer/',
                handle : 'transfer',
                showInMenu : true,
                controller : 'transfer',
                action : 'index'
            }
            ,{
                label : 'Cupones',
                label_en : 'Cupons',
                icon : 'fa-ticket',
                url : '/cupon/',
                showInMenu : true
                ,handle : 'cupon'
                ,controller : 'cupon'
                ,action : 'index'
            }
            ,{
                label : 'Instancias cupones',
                label_en : 'Cupon instances',
                icon : 'fa-ticket',
                url : '/cuponSingle/',
                showInMenu : true
                ,handle : 'cuponSingle'
                ,controller : 'cuponSingle'
                ,action : 'index'
            }
        ]
    }
    ,{
        name : 'reservations'
        ,label : 'Reservaciones'
        ,label_en : 'Reservations'
        ,icon : 'fa-car'
        ,actions : [
            {
                label : 'Todas',
                label_en : 'All',
                icon : 'fa-car',
                url : '/order/',
                handle : 'orders',
                showInMenu : true,
                controller : 'order',
                action : 'index'
            }
            ,{
                label : 'Reserva nueva'
                ,label_en : 'New reservation'
                ,icon : 'fa-car'
                ,url : '/order/neworder/'
                ,handle : 'orders'
                ,showInMenu : true
                ,controller : 'order'
                ,action : 'neworder'
            }
            ,{
                label : 'Reserva rápida'
                ,label_en : 'Quick reservation'
                ,icon : 'fa-car'
                ,url : '/order/quickorder/'
                ,handle : 'orders'
                ,showInMenu : true
                ,controller : 'order'
                ,action : 'quickorder'
            }
            ,{
                label : 'Reserva rápida (Tour)'
                ,label_en : 'Quick reservation (Tour)'
                ,icon : 'fa-compass'
                ,url : '/order/quicktour/'
                ,handle : 'orders'
                ,showInMenu : true
                ,controller : 'order'
                ,action : 'quicktour'
            }
        ]
    }
    ,{
        name : 'Folios'
        ,label : 'Folios'
        ,label_en : 'Folios'
        ,icon : 'fa-database'
        ,actions : [
            {
                label : 'Folios'
                ,label_en : 'Folios'
                ,icon : 'fa-database'
                ,url : '/folio/'
                ,showInMenu : true
                ,handle : 'folio'
                ,controller : 'folio'
                ,action : 'index'
            }
            ,{
                label : 'Asignar folio'
                ,label_en : 'Folio Assignment'
                ,icon : 'fa-user-secret'
                ,url : '/folio/assignment/'
                ,showInMenu : true
                ,handle : 'folio'
                ,controller : 'folio'
                ,action : 'assignment'
            }
        ]
    }
    ,{
        name : 'Reportes'
        ,label : 'Reportes'
        ,label_en : 'Reports'
        ,icon : 'fa-bar-chart'
        ,actions : [
            {
                label : 'Reportes'
                ,label_en : 'Reports'
                ,icon : 'fa-file-text-o'
                ,url : '/report/'
                ,showInMenu : true
                ,handle : 'reports'
                ,controller : 'reports'
                ,action : 'index'
            }
            ,{
                label : 'Gráficas'
                ,label_en : 'Charts'
                ,icon : 'fa-pie-chart'
                ,url : '/report/charts/'
                ,showInMenu : true
                ,handle : 'reports'
                ,controller : 'reports'
                ,action : 'index'
            }
        ]
    }
    ,{
        name : 'claims'
        ,label : 'Quejas y Objetos perdidos'
        ,label_en : 'Claims and Lost&Found'
        ,icon : 'fa-exclamation'
        ,actions : [
            {
                label : 'Quejas'
                ,label_en : 'Claims'
                ,icon : 'fa-exclamation'
                ,url : '/claim/'
                ,showInMenu : true
                ,handle : 'claim'
                ,controller : 'claim'
                ,action : 'index'
            }
            ,{
                label : 'Objetos perdidos'
                ,label_en : 'Lost&Found'
                ,icon : 'fa-question'
                ,url : '/lostandfound/'
                ,showInMenu : true
                ,handle : 'claim'
                ,controller : 'claim'
                ,action : 'index'
            }
        ]
    }
];
