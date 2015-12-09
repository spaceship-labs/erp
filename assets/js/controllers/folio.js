app.controller('folioCTL',function($scope,$http){
    $scope.selectedFoliosArray = [];
    $scope.addRemoveSelection = function(id){ 
        var value = $scope.selectedFolios[id];
        if(value && $scope.selectedFoliosArray.indexOf( id ) == -1 )
            $scope.selectedFoliosArray.push( id );
        else if( $scope.selectedFoliosArray.indexOf( id ) >= 0 )
            $scope.selectedFoliosArray.splice( $scope.selectedFoliosArray.indexOf( id ) , 1 );
    }
});
app.controller('folioEditCTL',function($scope,$http){
});