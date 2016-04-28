module.exports.interactions = {
    default : {}
    ,'caribe-maya' : {
        omitServiceOnReservation : true
        ,specialReservationMessage : "Si necesitas algún pediddo especial favor de comunicarte al área de reservaciones al siguiente número gratuito: 01 800 227 42 36"
        ,nationalPrices : true
        ,customContent : [
            {
                contentField : 'hotel'
                ,position : 1
                ,fields : [
                    {
                        label : 'Nombre',
                        label_en : 'Name',
                        type : 'text',
                        handle : 'name',
                        required : true,
                    },
                    {
                        label : 'Dirección',
                        label_en : 'Address',
                        type : 'text',
                        handle : 'address',
                    },
                    {
                        label : 'Ciudad',
                        label_en : 'City',
                        type : 'select',
                        handle : 'location',
                        object : 'locations',
                        on_Change : 'getZones',
                        required : true,
                    },
                    {
                        label : 'Zona',
                        label_en : 'Zone',
                        type : 'select',
                        handle : 'zone',
                        object : 'zones',
                        required : true,
                    },
                    {
                        label : 'Teléfonos',
                        label_en : 'Phones',
                        type : 'text',
                        handle : 'phones',
                    },
                    {
                        label : 'Categoría',
                        label_en : 'Category',
                        type : 'select',
                        handle : 'category',
                        object : 'categories',
                    },
                    {
                        label : 'Esquema de Temporadas',
                        label_en : 'Seasons scheme',
                        type : 'select',
                        handle : 'seasonScheme',
                        object : 'schemes',
                    },
                    {
                        label : 'Esquemas de Alimentacion',
                        label_en : 'Nutrition scheme',
                        type : 'multi-select',
                        handle : 'foodSchemes',
                        object : 'foodSchemes',
                        removeAction : '/hotel/removeFoodScheme',
                    },
                    {
                        label : "Visible en web"
                        ,label_en : "Visible on web"
                        ,type : 'checkbox'
                        ,handle : 'visible'
                    },
                    {
                        label : 'Permite reservar',
                        label_en : 'Allow booking',
                        type    : 'checkbox',
                        handle  : 'active',
                    },
                    {
                        label : 'Principal',
                        label_en : 'Principal',
                        type    : 'checkbox',
                        handle  : 'principal',
                        message : "Seleccionar para que en el front aparezca al principio",
                        message_en : "Seleccionar para que en el front aparezca al principio"
                    }
                ]
            }
        	,{
        		contentField : 'tour' //objeto al que se quiere agregar el campo
        		,position : 1 //número de posisición en el que se quiere insertar
        		,fields : [ //arreglo de campos a agregar, mismo formato que content
                    {
                        label : 'Nombre Español',
                        label_en : 'Spanish name',
                        type : 'text',
                        handle : 'name',
                        required : true,
                    },
                    {
                        label : 'Nombre para proveedor',
                        label_en : 'Name by provider',
                        type : 'text',
                        handle : 'name_by_provider',
                    },
                    {
                        label : 'Máximo de clientes',
                        label_en : 'Client max number',
                        type : 'select',
                        object : 'maxpax',
                        handle : 'pax',
                    },
                    {
                        label : 'Tarifa adultos',
                        label_en : 'Adult rate',
                        type : 'money',
                        handle : 'fee',
                    },

                    {
                        label : 'Tarifa niños',
                        label_en : 'Children rate',
                        type : 'money',
                        handle : 'feeChild',
                    },
                    {
                        label : 'Duración',
                        label_en : 'Duration',
                        type : 'text',
                        handle : 'duration',
                    },
                    {
                        label : "Duración"
                        ,label_en : 'Duration'
                        ,type : 'time'
                        ,handle : 'duration_formated'
                    },
                    {
                        label : 'Proveedor',
                        label_en : 'LocationProvider',
                        type : 'select',
                        handle : 'provider',
                        object : 'providers'
                    },
                    {
                        label : 'Categorías',
                        label_en : 'Categories',
                        type : 'multi-select',
                        handle : 'categories',
                        object : 'tourcategories',
                        removeAction : '/tour/removeCategory'
                    },
                    {
                        label : 'Ubicación',
                        label_en : 'Location',
                        type : 'select',
                        handle : 'location',
                        object : 'locations'
                    },
                    {
                        label : "¿Es visible en web?"
                        ,label_en : "It's visible on web?"
                        ,type : 'checkbox'
                        ,handle : 'visible'
                    },
                    {
                        label : 'Esquema de Temporadas',
                        label_en : 'Season schemes',
                        type : 'select',
                        handle : 'seasonScheme',
                        object : 'schemes',
                    },
                    {
                        label : '¿El traslado está incluido?',
                        label_en : 'The transfer is included?',
                        type : 'checkbox',
                        handle : 'haveTransfer'
                    }
        		]
        	}
        	,{
        		contentField : 'tourprovider'
        		,position : false //para ponerlo al final con un push
        		,fields : [
                    {
                        label : 'Código',
                        label_en : 'Code',
                        type : 'text',
                        handle : 'mkpid',
                    },
                    {
                        label : 'Código MX',
                        label_en : 'Code MX',
                        type : 'text',
                        handle : 'mkpidMX',
                        hideIfNotField : "mxnPrices",
                    },
        			{
                        label : 'Nombre'
                        ,label_en : 'Name'
                        ,type : 'text'
                        ,handle : 'name'
                        ,required : true
                    }
                    ,{
                        label : 'Razón social'
                        ,label_en : 'Corporate name'
                        ,type : 'text'
                        ,handle : 'business_name'
                    }
                    ,{
                        label: 'Dirección'
                        ,label_en : 'Address'
                        ,type : 'text'
                        ,handle : 'address'
                    }
                    ,{
                        label : 'Ciudad'
                        ,label_en : 'City'
                        ,type : 'select'
                        ,handle : 'location'
                        ,object : 'locations'
                    }
                    ,{
                        label : 'País'
                        ,label_en : 'Country'
                        ,type : 'text'
                        ,handle : 'country'
                    }
                    ,{
                        label : '¿Proporciona crédito?'
                        ,label_en : 'Credit admited?'
                        ,type : 'checkbox'
                        ,handle : 'isCredit'
                    }
                    ,{
                        label : 'Tipo de cambio'
                        ,label_en : 'Exchange rate'
                        ,type : 'text'
                        ,handle : 'exchange_rate'
                    }
                    ,{
                        label : 'Moneda base'
                        ,label_en : 'Base currency'
                        ,type : 'select'
                        ,object : 'currencies'
                        ,handle : 'base_currency'
                    }
                    ,{
                        label : '¿Usar precios para nacionales?',
                        label_en : 'Use nation prices?',
                        type : 'checkbox',
                        handle : 'mxnPrices',
                        on_Change : 'changePricesTable',
                    }
        		]
        	}
        ]
    }
    ,'yellow-transfers' : {
        mkp : true
    },'americanada' : {
        operaciones : true //este flag es para manejar precios de proveedores de transporte
    }
};
