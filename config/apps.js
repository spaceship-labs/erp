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
                showInMenu : true
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
                showInMenu : true
			}
		]
	},
	/* products */
    {
        name : 'products',
		label : 'Ventas',
		icon : 'fa-briefcase',
        actions : [
			{
				label : 'Ventas',
				icon : 'fa-briefcase',
                url : '/ventas/',
                handle : 'ventas',
                showInMenu : true
			},
            {
                label:'Cotizaciones',
                icon:'fa-database',
                url : '/salesQuote/',
                handle : 'cotizaciones',
                showInMenu : true
            },
			{
				label : 'Productos',
				icon : 'fa-cube',
                url : '/product/',
                handle : 'productos',
                showInMenu : true
			},
			{
				label : 'Categorias',
				icon : 'fa-cubes',
                url : '/product_type/',
                handle : 'categorias',
                showInMenu : true
			},
            {
                label:'Impresoras',
                icon:'fa-gears',
                url : '/machine/',
                handle : 'impresoras',
                showInMenu : true
            },
            {
                label:'Instalaciones',
                icon:'fa-wrench',
                url : '/installation/',
                handle : 'instalaciones',
                showInMenu : true
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
                showInMenu: true
            }
        ]
    },
    /* hotels */
    {
        name : 'hotels',
        label : 'Hoteles',
        icon : 'fa-building',
        actions : [
            {
                label : 'Hoteles',
                icon : 'fa-building-o',
                url : '/hotel/',
                handle : 'hoteles',
                showInMenu : true
            },
            {
                label : 'Temporadas',
                icon : 'fa-sun-o',
                url : '/season/',
                handle : 'temporadas',
                showInMenu : true
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
                showInMenu : true
            }
        ]
    },
    /* services */
    {
        name : 'services',
        label : 'Servicios',
        icon : 'fa-clipboard',
        actions : [
            {
                label : 'tours',
                icon : 'fa-compass',
                url : '/tour/',
                handle : 'tours',
                showInMenu : true
            },
            /*'/transfer/' : {
                label : 'Translados',
                icon : 'fa-cab'
            },*/
        ],
    }
];
