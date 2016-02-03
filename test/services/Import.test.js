var Import = require('../../api/services/Import'),
    should = require('should'),
    mockery = require('mockery');

describe('Import', function(){

    before(function(){//stubs.
        global.sails = {
            models: {},
            config: {}
        };
        global.Airport = {
            create:function(data){

                if(data.push){
                    for(var i=0; i<data.length; i++)
                        data[i].id = 'uidstring';
                }else
                    data.id = 'uidstring';
                return {
                    exec: function(done){
                        done(null, data);
                    }
                }
            }
        }; 

        global.Zone = {
            findOne: function(data){
                data.id = 'uidstring';
                return {
                    exec: function(done){
                        done(null, data);
                    }
                }
            },
            create:function(data){
                data.id = 'uidstring';
                return {
                    exec: function(done){
                        done(null, data);
                    }
                }
            }
        }; 
        
        sails.models.airport = Airport; //sails alias
        sails.models.zone = Zone;
        sails.models.location = Zone;
        sails.models.company = Zone;
        sails.models.currency = Zone;

        sails.models.company.attributes = {
            base_currency: { model: 'currency' } 
        };
    });

    var airport,
        company;
    beforeEach(function(){
        airport = {
            name: 'Ada Travel',
            location: 'nuevo location',
            zone: 'nueva zona',
            voucher_text_es: 'un texto',
            voucher_text_en: 'English text',
        };
   
        company = {
            name: 'Company 1',
            direccion: 'cancun q.roo',
            base_currency: 'MX'
        };

        sails.config.content = {
            airport: [ { label: 'Nombre',
                        label_en: 'Name',
                        type: 'text',
                        handle: 'name',
                        required: true },
                      { label: 'Ciudad',
                        label_en: 'City',
                        type: 'select',
                        handle: 'location',
                        object: 'locations',
                        on_Change: 'getZones',
                        required: true },
                      { label: 'Zona',
                        label_en: 'Zone',
                        type: 'select',
                        handle: 'zone',
                        object: 'zones',
                        required: true },
                      { label: 'Texto del Voucher Español',
                        label_en: 'Spanish Voucher text',
                        type: 'textarea',
                        handle: 'voucher_text_es' },
                      { label: 'Texto del Voucher Inglés',
                        label_en: 'English Voucher text',
                        type: 'textarea',
                        handle: 'voucher_text_en' } ],
            company : [		
                {
                    label : 'Nombre',
                    label_en : 'Name',
                    handle : 'name',
                    type : 'text',
                    required : true,
                },
                {
                    label : 'Direccion',
                    label_en : 'Address',
                    handle : 'address',
                    type : 'text',
                    required : true,
                },
                {
                    label : 'Moneda Base',
                    label_en : 'Base currency',
                    type : 'select',
                    handle : 'base_currency',
                    object : 'currencies',
                    required : true,
                },
			]
        };

    });

    describe('import2Model', function(){

        it('should import data from Object to sails.models.model', function(done){ 
            Import.import2Model(airport, 'airport', function(err, res){
                should.not.exist(err);
                res.id.should.be.an.instanceOf(String);
                done();
            });    
        });

        it('should import data from Object to global.Model', function(done){ 
            Import.import2Model(airport, 'Airport', function(err, res){
                should.not.exist(err);
                res.id.should.be.an.instanceOf(String);
                done();
            });    
        });


        it('should return err if not model', function(done){
            var data = {};
            Import.import2Model(airport, 'notexistmodel', function(err){
                err.should.be.an.instanceOf(Error);
                done();
            });
        })

    });

    describe('ifContentValid', function(){

        it('should return err if not data in config/content.js', function(done){
            var airport = {
                name: 'airport mex'
            };

            Import.ifContentValid(airport, 'airportnotexist', function(err){
                err.should.be.an.instanceOf(Error);
                done();
            });
        
        });

        it('should return err if not validate with config/content.js', function(done){
            var airport = {
                name: 'airport mex'
            };

            Import.ifContentValid(airport, 'airport', function(err){
                err.should.be.an.instanceOf(Error);
                done();
            }); 
        });

        it('should not return err', function(done){
            Import.ifContentValid(airport, 'airport', function(err, list, model){
                should.not.exist(err);
                list.should.equal(airport);
                model.should.equal('airport');
                done();
            });
	
        });

        it('should work with array', function(done){
            var airports = [airport, airport];
            Import.ifContentValid(airports, 'airport', function(err, list, model){
                should.not.exist(err);
                list.should.equal(airports);
                model.should.equal('airport');
                done();            
            });
        
        });

        it('should work with array, return err if not valid', function(done){
            var airports = [{name:'aerport 1'}, {name:'airport 2'}];
            Import.ifContentValid(airports, 'airport', function(err, list, model){
                err.should.be.an.instanceOf(Error);
                should.not.exist(list);
                should.not.exist(model);
                done();            
            });
        
        });
    });

    describe('replaceFieldsWithCollection', function(){
        
        it('if field is a relatiship findOrCreate', function(done){
            Import.replaceFieldsWithCollection(airport, 'airport', function(err, newAirport){
                should.not.exist(err);
                newAirport.zone.should.be.equal('uidstring');
                newAirport.location.should.be.equal('uidstring');
                newAirport.voucher_text_es.should.be.equal('un texto');;
                newAirport.name.should.be.equal('Ada Travel');
                done();
            }); 
        });

        it('if field is a relatiship findOrCreate (array)', function(done){
            var data = [airport, airport];
            Import.replaceFieldsWithCollection(data, 'airport', function(err, newAirports){
                should.not.exist(err);
                newAirports.should.be.an.instanceOf(Array);
                newAirports.forEach(function(air){
                    air.zone.should.be.equal('uidstring');
                    air.location.should.be.equal('uidstring');
                    air.voucher_text_es.should.be.equal('un texto');;
                    air.name.should.be.equal('Ada Travel');    
                });
                done();
            }); 
        });

        it('if field is a relatiship findOrCreate, if not exist sails.models[collection] find in sails.models[c].attributes', 
        function(done){
            Import.replaceFieldsWithCollection(company, 'company', function(err, newCompany){
                should.not.exist(err);
                newCompany.base_currency.should.be.equal('uidstring');
                done();
            }); 
        });

    });

    describe('normalizeFields', function(){
        var airport;
        beforeEach(function(){
            airport = {Nombre: 'Ada Travel', Location: 'Cancun' };
        });

        it('should replace fields with label', function(done){
            Import.normalizeFields(airport, 'airport', function(err, normalize){
                should.not.exist(err);
                normalize.name.should.equal('Ada Travel');
                normalize.location.should.equal('Cancun');
                normalize.should.not.have.property('Nombre');
                normalize.should.not.have.property('Location');
                done();
            });
        });

        it('should replace fields with label_en', function(done){
            airport.Zone = 'Zona 1'
            Import.normalizeFields(airport, 'airport', function(err, normalize){
                should.not.exist(err);
                normalize.name.should.equal('Ada Travel');
                normalize.location.should.equal('Cancun');
                normalize.zone.should.equal('Zona 1');
                normalize.should.not.have.property('Nombre');
                normalize.should.not.have.property('ciudad');
                normalize.should.not.have.property('Zone');
                done();
            });
        });

        it('should not return err if name is set but not name_en/name_pt etc.. [alias]', function(done){
            sails.config.content.airport.push(
                      { label: 'Name_en',
                        label_en: 'Name_en',
                        type: 'text',
                        handle: 'name_en',
                        required: true
                         }
            );
            Import.normalizeFields(airport, 'airport', function(err, air, model){
                should.not.exist(err);
                air.name.should.equal('Ada Travel');
                air.name_en.should.equal('Ada Travel');
                air.location.should.equal('Cancun');
                done();
            });
	
        });

        it('should not return err if name is and alias not replace.', function(done){
            sails.config.content.airport.push(
                      { label: 'Name_en',
                        label_en: 'Name_en',
                        type: 'text',
                        handle: 'name_en',
                        required: true
                         }
            );
            airport['Name_en'] = 'other';
            Import.normalizeFields(airport, 'airport', function(err, air, model){
                should.not.exist(err);
                air.name.should.equal('Ada Travel');
                air.name_en.should.equal('other');
                air.location.should.equal('Cancun');
                done();
            });
	
        });

        it('should use default if exist', function(done){
            sails.config.content.airport.push(
                {
                    label : 'Moneda Base',
                    label_en : 'Base currency',
                    type : 'select',
                    handle : 'base_currency',
                    object : 'currencies',
                    required : true,
                    default:'Pesos'
                }
            );
            Import.normalizeFields(airport, 'airport', function(err, air, model){
                should.not.exist(err);
                air.name.should.equal('Ada Travel');
                air.base_currency.should.equal('Pesos');
                air.location.should.equal('Cancun');
                done();
            });
	
        });


        it('should replace fields with label (array)', function(done){
            var airports = [airport, airport];
            Import.normalizeFields(airports, 'airport', function(err, normalize){
                should.not.exist(err);
                normalize.should.be.an.instanceOf(Array);
                normalize.forEach(function(air){
                    air.name.should.equal('Ada Travel');
                    air.location.should.equal('Cancun');
                    air.should.not.have.property('Nombre');
                    air.should.not.have.property('ciudad');
                });
                done();
            }); 
        });
    });

    describe('checkAndImport', function(){

        var aeropuerto;
        before(function(){
            aeropuerto = {
                Nombre: 'Ada Travel',
                Ciudad: 'nuevo location',
        		zona: 'nueva zona',
                'Texto del Voucher Español': 'un texto',
                'Texto del Voucher Inglés': 'English text',
            };
        
        });
        
        it('should import correct format object', function(done){ 
            Import.checkAndImport(aeropuerto, 'airport', function(err, newAirport){
                should.not.exist(err); 
                newAirport.id.should.equal('uidstring');
                newAirport.name.should.equal('Ada Travel');
                newAirport.location.should.equal('uidstring');
                newAirport.zone.should.equal('uidstring');
                newAirport.voucher_text_es.should.equal('un texto');
                newAirport.voucher_text_en.should.equal('English text');
                done();
            });
        });

        it('should import correct format object (array[es,en,content])', function(done){
            var news = [aeropuerto, airport,   {
                name: 'Ada Travel',
                city: 'nuevo location',
        		zone: 'nueva zona',
                'Spanish Voucher text': 'un texto',
                'English Voucher text': 'English text',}];

            Import.checkAndImport(news, 'airport', function(err, newAirports){
                should.not.exist(err); 
                newAirports.should.be.an.instanceOf(Array);
                newAirports.forEach(function(air){
                    air.id.should.equal('uidstring');
                    air.name.should.equal('Ada Travel');
                    air.location.should.equal('uidstring');
                    air.zone.should.equal('uidstring');
                    air.voucher_text_es.should.equal('un texto');
                    air.voucher_text_en.should.equal('English text');
                });
                done();
            });
        });
    
    });

    describe('files', function(){

        var files,
        values,
        valuesClearHtml;
        before(function(){
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            var pyspreadsheet = {
                SpreadsheetReader:{
                    read: function(file, done){
                        done(null, { 
                            sheets: [{
                                name: 'hoja1',
                                rows: [

                                    [{
                                        address:'a0',
                                        value: null,
                                    },{
                                        address:'b0',
                                        value: null,                                    
                                    },{
                                        address:'c0',
                                        value: null,                                    
                                    },{
                                        address:'d0',
                                        value: null,
                                    
                                    }
                                    ],
                                    
                                    [{
                                        address: 'a1',
                                        value: 'Name',
                                    },{
                                        address: 'b1',
                                        value: 'Zone'
                                    }, {
                                        address: 'c1',
                                        value: 'Location'
                                    }],
                                    [{
                                        address: 'a2',
                                        value: 'Airport 1',
                                    },{
                                        address: 'b2',
                                        value: 'alguna zona 2'
                                    },{
                                        address: 'c2',
                                        value: 'cancun'
                                    }],
                                    [{
                                        address: 'a3',
                                        value: 'air 3',
                                    },{
                                        address: 'b3',
                                        value: 'other 3'
                                    },{
                                        address: 'b2',
                                        value: 'chetumal'
                                    }]
                                ]
                            }, {
                                name: 'hoja2',
                                rows:[
                                    [{
                                        address: 'a1',
                                        value:'Name'
                                    },{
                                        address: 'b1',
                                        value: 'Zone'
                                    }],
                                    [{
                                        address: 'a2',
                                        value: 'Air 1'
                                    },{
                                        address: 'b2',
                                        value: 'zone 2'
                                    }, {
                                        address: 'b4',
                                        value: '<p>text </br> <strong>lol </strong></p>'
                                    }]
                                ]
                            }]
                        });
                    }
                }
            };
            mockery.registerMock('pyspreadsheet', pyspreadsheet);
            files = require('../../api/services/Import').files;
            values = [];
            valuesClearHtml = [];
            var tmp = [['Name','Zone', 'Location'], ['Airport 1', 'alguna zona 2', 'cancun'], ['air 3', 'other 3', 'chetumal']];
            values.push(tmp);//hoja 1
            valuesClearHtml.push(tmp);
            tmp = [['Name', 'Zone'], ['Air 1', 'zone 2', '<p>text </br> <strong>lol </strong></p>']];
            values.push(tmp);//hoja 2
            valuesClearHtml.push([['Name', 'Zone'], ['Air 1', 'zone 2', 'text  lol']]);
        });

        after(function(){
            mockery.disable();
        });
    
        describe('xlsx2Json',function(){
            
            it('should return json from xlsx object', function(done){
                
                files.xlsx2Json('file.xlsx', function(err, json){

                    json.should.be.an.instanceOf(Object);
                    json.should.have.property('sheets').and.be.an.instanceOf(Array);
                    json.sheets.forEach(function(sheet, i){
                        sheet.should.have.property('name');
                        sheet.should.have.property('values');
                        sheet.values.should.be.eql(values[i]);
                    });
                    done();

                });
            
            });

	    it('should clear html tags from xlsx', function(done){
	    	files.xlsx2Json('file.xlsx',{removeHtmlTags: true}, function(err, json) {

                    json.should.be.an.instanceOf(Object);
                    json.should.have.property('sheets').and.be.an.instanceOf(Array);
                    json.sheets.forEach(function(sheet, i){
                        sheet.should.have.property('name');
                        sheet.should.have.property('values');
                        sheet.values.should.be.eql(valuesClearHtml[i]);
                    });
                    done();
            
            });
	    });

        });

        describe('array2Model', function(){
            var json; 
            before(function(){
                json = {
                    sheets:[
                        {
                            name: 'airports',
                            values: [
                                ['name','zone'], 
                                ['Airport 1', 'alguna zona 2'],
                                ['Airport 2', 'other zone'],
                                ['other airport', 'last zone']
                            ]
                        }
                    ]
                }            
            });
            
            it('should return json like model', function(done){
                var sheet = json.sheets[0];
                files.array2Model(sheet, function(err, modelFormat){
                    var names = ['Airport 1', 'Airport 2', 'other airport'],
                    zones = ['alguna zona 2', 'other zone', 'last zone'];
                    modelFormat.length.should.equal(3);
                    modelFormat.forEach(function(air, i){
                        air.should.have.property('name');
                        air.should.have.property('name').and.be.equal(names[i]);
                        air.should.have.property('zone').and.be.equal(zones[i]);
                    });
                    done();
                });
            
            });

            it('should add extra value [optional]', function(done){
                var sheet = json.sheets[0];
                files.array2Model(sheet,{company:'idcompany'}, function(err, modelFormat){
                    var names = ['Airport 1', 'Airport 2', 'other airport'],
                    zones = ['alguna zona 2', 'other zone', 'last zone'];
                    modelFormat.length.should.equal(3);
                    modelFormat.forEach(function(air, i){
                        air.should.have.property('name');
                        air.should.have.property('name').and.be.equal(names[i]);
                        air.should.have.property('zone').and.be.equal(zones[i]);
                        air.should.have.property('company').and.be.equal('idcompany');
                    });
                    done();
                });
            });

            it('should return json like model only with values, if null ignore', function(done){
                var values = [[null, null, null]].concat(json.sheets[0].values);
                files.array2Model(values, function(err, modelFormat){
                    var names = ['Airport 1', 'Airport 2', 'other airport'],
                    zones = ['alguna zona 2', 'other zone', 'last zone'];
                    modelFormat.length.should.equal(3);
                    modelFormat.forEach(function(air, i){
                        air.should.have.property('name');
                        air.should.have.property('name').and.be.equal(names[i]);
                        air.should.have.property('zone').and.be.equal(zones[i]);
                    });
                    done();
                });                
            });

            it('should return error', function(done){
                files.array2Model(null, function(err){
                    err.should.be.an.instanceOf(Error);
                    done();
                });
            });

        });

        describe('xlsx2model', function(){
            
            it('should return object model from xlsx', function(done){
                files.xlsx2model('file.xlsx', function(err, objs){
                    objs.should.be.an.instanceOf(Array);
                    objs.length.should.equal(2);
                    objs[0].length.should.equal(2);
                    objs[1].length.should.equal(1);
                    done();
                });
            });
        
        });

        describe('fromXlsx', function(){
            
            it('if xlsx content a valid format should create with values', function(done){
                files.fromXlsx('file.xlsx', 1 , 'airport', function(err, newAirports){
                    newAirports.should.be.an.instanceOf(Array);
                    newAirports.forEach(function(air){
                        air.id.should.equal('uidstring');
                    });
                    done();
                });
            
            });
        
        });
    });

});
