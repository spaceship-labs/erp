/**
 * ExportDataController
 *
 * @description :: Server-side logic for managing Exportdatas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment-timezone'),
    anchor = require('anchor');

module.exports = {
    csv: function(req, res){
        var form = req.params.all(),
        invalid = anchor(form).to({
                        type:{
                            model: 'string',
                        }
                    });

        if(invalid)
            return res.json(invalid);

        if(form.sort && form.sortField){
            var sort = {};
            sort[form.sortField] = form.sort;
            form.sort = sort;
        }

        if(form.fieldNames && !form.fieldNames.push){
            form.fieldNames = form.fieldNames.split(',');
            if(form.fieldNames.indexOf('createdAt') == -1){
                form.fieldNames.push('createdAt');
            }
        }

        if(form.filterField && form.filter){
            form.where = {};
            form.where[form.filterField] = form.filter;
        }

        var name = form.model + '-' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
        Export.filter(form, function(err, list){
            if(err) return res.json(err);
            Export.list2csv(list, function(err, csv){
                res.attachment(name);
                res.end(csv, 'UTF-8');
            });
        });
    },
    to_mkp : function(req,res){
        var fields = ['Fecha de registro','Estatus de registro','Tipo de reserva','Lugar origen'
            ,'Clave Reserva','Tipo de servicio','Tipo de viaje','Clave tipo de Unidad','Nombre de Tipo de Unidad'
            ,'Clave del Hotel','Nombre hotel','Habitación','Nombre del Pasajero','Apellidos del pasajero'
            ,'Cantidad de Adultos','Cantidad de Niños','Fecha de llegada','Hora de llegada'
            ,'Fecha de salida','Clave de Aerolínea de Salida','Nombre de Aerolínea','Hora de Vuelo'
            ,'Hora de PickUp','Precio','Descuento','Subtotal','Total','Moneda','Tipo de cambio'
            ,'Observaciones','Clave de Agencia','Nombre de Agencia','Reserva de Agencia'];
        /*
            NOTA: Como sólo se exportan las reservas de los transportes podemos obtener directamente la reserva 
            sin tener que agruparlo por su 'order'
            - Serán 3 estados por la cuestion de los 'round trip', puede darse a medias un servicio, 3 = completado
        */
        var params = req.params.all();
        var form = {
            assigned : { "$ne" : '3' }
            ,reservation_type : 'transfer'
            ,'$or' : [
                { 
                    '$and' : [
                        { arrival_date : { '$gte' : new Date( params.from ) } }
                        ,{ arrival_date : { '$lte' : new Date( params.to ) } }
                    ]
                }
                ,{ 
                    '$and' : [
                        { departure_date : { '$lte' : new Date( params.from ) } }
                        ,{ departure_date : { '$lte' : new Date( params.to ) } }
                    ]
                }
            ]
        }
        var list = [];
        list.push(fields);
        Reservation.find().where( form )
        .populate('transfer').populate('hotel').populate('client').populate('company')
        .exec(function(e,reservations){
            for(var y in reservations){
                var i = 0;
                var item = reservations[y];
                var x = [];
                x[i] = formatDate(item.createdAt,'date');
                x[++i] = item.state == 'canceled'?'C':( item.createdAt == item.updatedAt?'N':'M' );
                x[++i] = item.transfer_type; 
                x[++i] = 0; //3 lugar de origen
                x[++i] = item.folio;
                x[++i] = 0;//5 tipo servicio
                x[++i] = item.travelType;//6 tipo viaje
                x[++i] = 0;//7 clave tipo de unidad
                x[++i] = item.transfer.name;
                x[++i] = item.hotel?item.hotel.mkpid:'';
                x[++i] = item.hotel?item.hotel.name:'';
                x[++i] = item.room||'';
                x[++i] = item.client.name;
                x[++i] = '';//13 apellidos cliente
                x[++i] = item.pax;
                x[++i] = item.kidPax;
                x[++i] = formatDate(item.arrival_date,'date');
                x[++i] = formatDate(item.arrival_time,'time');
                x[++i] = formatDate(item.departure_date,'date');
                x[++i] = item.departure_airline; //mkpid
                x[++i] = item.departure_airline; //name
                x[++i] = formatDate(item.departure_time,'time');
                x[++i] = formatDate(item.departurepickup_time,'time'); // formato a hrs
                x[++i] = item.type=='one_way'?item.fee_adults:item.fee_adults_rt;//precio
                x[++i] = 0;//descuento
                x[++i] = 0;//subtotal
                x[++i] = item.fee;//total
                x[++i] = item.currency.currency_code;
                x[++i] = item.notes;
                x[++i] = item.company.mkpid;
                x[++i] = item.company.name;
                x[++i] = 0;//número de reserva de agencia
                list.push(x);
            }
            var name = 'MKP report -' + moment().tz('America/Mexico_City').format('D-MM-YYYY') + '.csv';
            Export.mkp_report(list,function(err,csv){
                res.attachment(name);
                res.end(csv, 'UTF-8');
            })
        }); 
    }
};
//regresa una fecha de la sb a el formato que necesita MKP
function formatDate(date,type){
    r = '';
    if(date && type == 'date'){
        var aux = new Date(date);
        var m = aux.getMonth() + 1;
        m = m<10?'0'+m:m+'';
        r = aux.getFullYear() + m;
        m = aux.getDate();
        m = m<10?'0'+m:m;
        r += m;
    }else if( date && type == 'time' ){
        var aux = new Date(date);
        var m = aux.getHours();
        m = m<10?'0'+m:m+'';
        r = m;
        var m = aux.getMinutes();
        m = m<10?'0'+m:m+'';
        r += m;
    }
    return r;
}