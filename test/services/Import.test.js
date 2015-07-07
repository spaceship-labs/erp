var Import = require('../../api/services/Import'),
should = require('should');

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
                        handle: 'voucher_text_en' } ]
        };

    });

    var airport;
    before(function(){
        airport = {
            name: 'Ada Travel',
            location: 'nuevo location',
    		zone: 'nueva zona',
            voucher_text_es: 'un texto',
            voucher_text_en: 'English text',
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
    });

    describe('normalizeFields', function(){
        var airport;
        before(function(){
            airport = {Nombre: 'Ada Travel', ciudad: 'Cancun' };
        });

        it('should replace fields with label', function(done){
            Import.normalizeFields(airport, 'airport', function(err, normalize){
                should.not.exist(err);
                normalize.name.should.equal('Ada Travel');
                normalize.location.should.equal('Cancun');
                normalize.should.not.have.property('Nombre');
                normalize.should.not.have.property('ciudad');
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

});
