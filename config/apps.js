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
                label : 'Precios',
                label_en : 'Prices',
                icon : 'fa-money',
                url : '/transferprice/',
                showInMenu : false,
                controller : 'transferprice',
                action : 'index'
            },
            {
                label : 'Unidades',
                label_en : 'Unities',
                icon : 'fa-bus',
                url : '/unity/',
                showInMenu : false,
                controller : 'unity',
                action : 'index'
            },
            {
                label : 'Tipos de unidad',
                label_en : 'Unity types',
                icon : 'fa-th-list',
                url : '/unitytype/',
                showInMenu : false,
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
        /*actions : [
            {
                label: 'Buscar',
                label_en : 'Search',
                icon: 'fa-user',
                url: '/clientes/',
                handle: 'clientes',
                showInMenu: true,
                controller : 'client',
                action : 'index'
            }
        ]*/
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
        /*actions   : [
            {
                label : 'Circuitos',
                label_en : 'Circuits',
                icon : 'fa-dropbox',
                url : '/packagetour/',
                handle : 'packagetour',
                showInMenu : true,
                controller : 'packagetour',
                action : 'index'
            }
        ]*/
    },
    /* transfers */
    {
        name : 'transfers',
        label : 'Servicios',
        label_en : 'Services',
        icon : 'fa-clipboard',
        actions : [
            {
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
            ,{
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
                label : 'Traslados',
                label_en : 'Transfers',
                icon : 'fa-road',
                url : '/transfer/',
                handle : 'transfer',
                showInMenu : true,
                controller : 'transfer',
                action : 'index'
            }
            /*,{
                label : 'Reservaciones',
                label_en : 'Reservations',
                icon : 'fa-car',
                url : '/order/',
                handle : 'orders',
                showInMenu : true,
                controller : 'order',
                action : 'index'
            }*/
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
    },
    {
        name : 'transport'
        ,label : 'Transportes'
        ,label_en : 'Transport'
        ,icon : 'fa-road'
        ,actions : [
            {
                label : 'Vehiculo'
                ,label_en : 'Car'
                ,icon : 'fa-car'
                ,url : '/Transport/'
                ,showInMenu : true
                ,handle : 'transport'
                ,controller : 'transport'
                ,action : 'index'
            },
            {
                label : 'Precio'
                ,label_en : 'Price'
                ,icon : 'fa-money'
                ,url : '/TransportPrice/'
                ,showInMenu : true
                ,handle : 'transport'
                ,controller : 'transport'
                ,action : 'price'
            },
            {
                label : 'Asignar'
                ,label_en : 'Asign'
                ,icon : 'fa-clock-o'
                ,url : '/TransportAsign/'
                ,showInMenu : true
                ,controller : 'transportasign'
                ,action : 'index'
            },
            {
                label : 'Solicitar'
                ,label_en : 'Request'
                ,icon : 'fa-clock-o'
                ,url : '/TransportAsignRequest/'
                ,showInMenu : true
                ,controller : 'transportasignrequest'
                ,action : 'index'
            }
        ]
    }
];
