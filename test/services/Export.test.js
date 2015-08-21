var Export = require('../../api/services/Export'),
    should = require('should');

describe('Export', function(){

    var company_uvc, company_uvc2, company_uvc3;

    beforeEach(function(){
        company_uvc = {
            base_currency: '54e282e455803f8a75ff9cfe',
            address: 'Cancún',
            name: 'UVC',
        };

        company_uvc2 = {
            base_currency: '54e282e455803f8a75ff9cfc',
            name: 'UVC2',
        };
        company_uvc3 = {
            name: 'UVC3',
        };
    });

    describe('normalizeFields', function(){
        it('should return arrays of fields name', function(done){
            Export.normalizeFields(company_uvc, function(err, data){
                data.should.be.an.instanceOf(Array);
                data[0].should.be.eql(['base_currency', 'address', 'name']);
                done();
            });
        });

        it('should return arrays of values orderly', function(done){
            Export.normalizeFields([company_uvc, company_uvc2, company_uvc3, {base_currency:'12121212'}, {}], function(err, data){
                data[1].should.be.eql(['54e282e455803f8a75ff9cfe', 'Cancún', 'UVC']);
                data[2].should.be.eql(['54e282e455803f8a75ff9cfc', '', 'UVC2']);
                data[3].should.be.eql(['', '', 'UVC3']);
                data[4].should.be.eql(['12121212','','']);
                data[5].should.be.eql(['','','']);
                done();
            });
        });

        it('should returns arrays of values work with boolean', function(done){
            Export.normalizeFields([{name:'test', active:true, address:11},{active:false}, {}], function(err, data){
                data[0].should.be.eql(['name', 'active', 'address']);
                data[1].should.be.eql(['test', true, 11]);
                data[2].should.be.eql(['', false, '']);
                data[3].should.be.eql(['', '', '']);
                done();
            });
        });

        it('should return a formated Object', function(done){
            var companyWithObjs = {
                name: 'Test',
                contract: {
                        filename: '14398421366976884709.pdf',
                        name: 'horario invierno.pdf',
                        type: 'application/pdf',
                        size: 105844,
                        typebase: 'application' 
                },
            };
            
            Export.normalizeFields(companyWithObjs, function(err, data){
                data[0].should.be.eql(['name', 'contract/filename', 'contract/name','contract/type', 'contract/size', 'contract/typebase']);
                data[1].should.be.eql(['Test', '14398421366976884709.pdf', 'horario invierno.pdf', 'application/pdf', 105844, 'application']);
                done();
            });
		
        });

        it('should return a formated Array', function(done){
            var companyWithArray = {
                name: 'Test',
                files: [{
                    filename:'file1.pdf',
                    size: 1000,
                    type: 'application/pdf',
                    typebase: 'application'
                },{
                    typebase: 'application',
                    type: 'application/pdf',
                    size: 100,
                    filename:'file2.jpg'
                
                }]
            };
            Export.normalizeFields(companyWithArray, function(err, data){
                data[0].should.be.eql(['name', 'files']);
                data[1].should.be.eql(['Test', '[{"filename":"file1.pdf"|"size":1000|"type":"application/pdf"|"typebase":"application"}|{"typebase":"application"|"type":"application/pdf"|"size":100|"filename":"file2.jpg"}]']);

                done();
            });
        
        });
    });

    describe('model2csv', function(){
        it('should parse model to csv format', function(done){
            Export.model2csv(company_uvc, function(err, data){
                data.should.be.an.instanceOf(String);
                data.should.equal('base_currency,address,name\n54e282e455803f8a75ff9cfe,Cancún,UVC\n');
                done();
            });
        }); 

        it('should parse model to csv format with spaces and orderly', function(done){
            Export.model2csv([company_uvc, company_uvc2, company_uvc3], function(err, data){
                data.should.be.an.instanceOf(String);
                data.should.equal('base_currency,address,name\n54e282e455803f8a75ff9cfe,Cancún,UVC\n54e282e455803f8a75ff9cfc,,UVC2\n,,UVC3\n');
                done();
            });
        }); 
    });
});
