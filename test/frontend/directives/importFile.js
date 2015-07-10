describe('importFiles', function(){

    var $compile,
        $rootScope;

    beforeEach(module('spaceerp'));

    beforeEach(module('assets/templates/partials/importFiles.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    var template;
    beforeEach(function(){
        template = $compile("<import-files> </import-files>")($rootScope);
        $rootScope.$digest();
    });
    
    it('should replace html', function(){
        template.html().should.equal('lidless, wreathed in flame 2 times');
    });

});
