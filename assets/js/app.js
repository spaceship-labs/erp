var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; //Underscore must already be loaded on the page
});

var app = angular.module('spaceerp',['ui.calendar','ui.bootstrap','ngTagsInput','angularFileUpload','angular-loading-bar','xeditable','underscore','leaflet-directive','ui.tinymce','chart.js','duScroll']);

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
