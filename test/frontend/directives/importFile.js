describe('importFiles', function(){

    var $compile,
        $scope;

    beforeEach(module('spaceerp'));

    beforeEach(module('/templates/partials/importFiles.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $scope = _$rootScope_;
    }));

    var template, responseSheets;
    beforeEach(function(){
        template = $compile("<div import-files import-type='hotel'></div>")($scope);
        $scope.$digest();
        responseSheets = {
            sheets: [
                { 
                    name: 'sheet 1',
                    values: [['name','zone'], ['name 1','zone 1'],['name 2','zone 2']],
                },{
                    name: 'sheet 2',
                    values: [['Name', 'Zone'], ['NAME 1', 'ZONE 1'],['NAME 2', 'ZONE 2']],
                }
            ]	
        };

    });

    describe('file upload', function(){

        it('should render fileupload if not sheets', function(){
            var sheets = template.find('.sheets');
            sheets.length.should.equal(0);
            var uploader = template.find('.upload');
            uploader.length.should.equal(1);
        });
    
    });

    describe('showData', function(){
        
        beforeEach(function(){
            //$scope.showData(responseSheets); if not params
            template.isolateScope().showData(responseSheets)
            $scope.$digest();
        });

        it('should render name of sheets', function(){
            var sheets = template.find('.sheet-name');
            sheets.length.should.equal(2);
            sheets.eq(0).text().should.equal('sheet 1')
            sheets.eq(1).text().should.equal('sheet 2')
        });
    
        it('should render name of labels', function(){
            var labels = template.find('.sheets th');
            labels.length.should.equal(4);
            labels.eq(0).text().should.equal('name');
            labels.eq(1).text().should.equal('zone');
            labels.eq(2).text().should.equal('Name');
            labels.eq(3).text().should.equal('Zone');
        });

        it('should render row', function(){
            var rows = template.find('.sheets .rows');
            rows.length.should.equal(4);
        });

        it('should render cells', function(){
            var cells = template.find('.sheets .cell');
            cells.eq(0).text().should.equal('name 1');
            cells.length.should.equal(8);
        });
    
    });
    
});
