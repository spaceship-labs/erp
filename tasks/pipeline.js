/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
	//'styles/**/*.css',
	'/bower_components/roboto-fontface/roboto-fontface.css',
	'/bower_components/lato/css/lato.css',
	'/bower_components/sass-bootstrap-glyphicons/css/bootstrap-glyphicons.css',
	'/bower_components/chosen/chosen.min.css',
	"/bower_components/ng-tags-input/ng-tags-input.min.css",
	'/bower_components/angular-loading-bar/build/loading-bar.min.css',
	'/bower_components/fullcalendar/fullcalendar.css',
	'/bower_components/leaflet/dist/leaflet.css',
	'/styles/bootstrap-responsive.min.css',
	'/styles/default.css',
	'/styles/css/jquery.ui.css',
	//'/styles/css/animate.min.css',
//	'/styles/css/animate.delay.css',
	'/styles/css/isotope.css',
	'/styles/css/colorbox.css',
	'/styles/css/uniform.tp.css',
	'/styles/css/colorpicker.css',
	'/styles/css/jquery.jgrowl.css',
	'/styles/css/jquery.alerts.css',
	'/styles/css/jquery.tagsinput.css',
	'/styles/css/ui.spinner.css',
	'/styles/css/jquery.chosen.css',
	'/styles/css/bootstrap.css',
	'/styles/css/bootstrap-theme.min.css',
	'/styles/css/font-awesome.min.css',
    '/bower_components/angular-xeditable/dist/css/xeditable.css',
    '/bower_components/angular-chart.js/dist/angular-chart.css',
	//'/styles/css/*.css',
	'/styles/general.css',
	'/styles/importer.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

	// Dependencies like sails.io.js, jQuery, or Angular
	// are brought in here
	'/bower_components/jquery/jquery.min.js',
	'/bower_components/jquery/dist/jquery.min.js',
	'/js/dependencies/**/*.js',
    "/bower_components/modernizr/modernizr.js",
    "/bower_components/jquery-browser-detection/src/browser-detection.js",
	"/bower_components/bootstrap/dist/js/bootstrap.js",
	'/bower_components/ng-file-upload/angular-file-upload-html5-shim.min.js',
	"/bower_components/angular/angular.min.js",
    "/bower_components/tinymce/tinymce.min.js",
	"/bower_components/ng-file-upload/angular-file-upload.js",
	"/bower_components/chosen/chosen.jquery.min.js",
	"/bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min.js",
	"/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js",
	//"/bower_components/jquery-migrate/jquery-migrate.js",
	"/bower_components/jquery-ui/ui/minified/jquery-ui.min.js",
	"/bower_components/jquery-form/jquery.form.js",
	"/bower_components/jquery-cookie/jquery.cookie.js",
	"/bower_components/flot/jquery.flot.js",
	"/bower_components/flot/jquery.flot.resize.js",
	"/bower_components/ng-tags-input/ng-tags-input.js",
	"/bower_components/slimScroll/slimScroll.js",
	"/bower_components/angular-ui-sortable/sortable.js",
    "/bower_components/angular-ui-date/src/date.js",
	"/bower_components/angular-loading-bar/build/loading-bar.min.js",
	'/bower_components/angular-ui-calendar/src/calendar.js',
	'/bower_components/fullcalendar/fullcalendar.js',
	'/bower_components/fullcalendar/gcal.js',
	'/bower_components/angular-xeditable/dist/js/xeditable.js',    
	'/bower_components/moment/min/moment-with-langs.min.js',
    '/bower_components/underscore/underscore-min.js',
	'/bower_components/leaflet/dist/leaflet.js',
	'/bower_components/leaflet-plugins/layer/tile/Google.js',
	'/bower_components/angular-leaflet/dist/angular-leaflet-directive.js',
    '/bower_components/angular-ui-tinymce/src/tinymce.js',
	'/bower_components/Chart.js/Chart.js',
	"/bower_components/jquery-steps/jquery.steps.min.js",
    "/bower_components/parsleyjs/dist/parsley.js",
    "/bower_components/angular-scroll/angular-scroll.min.js",
	"/js/themejs/*.js",                                            
	"/js/{app.js,custom.js,shared.js}",//ignore setup.js 
	'/js/directives/*.js', 
	//'/js/controllers/*.js', 
];                                                                     
                                                                       
                                                                       
// Client-side HTML templates are injected using the sources below     
// The ordering of these templates shouldn't matter.                   
// (uses Grunt-style wildcard/glob/splat expressions)                  
//                                                                     
// By default, Sails uses JST templates and precompiles them into      
// functions for you.  If you want to use jade, handlebars, dust, e    tc.,
// with the linker, no problem-- you'll just want to make sure the     precompiled
// templates get spit out to the same file.  Be sure and check out     `tasks/README.md`
// for information on customizing and installing new tasks.            
var templateFilesToInject = [                                          
	'templates/**/*.html'                                          
];
                                                                       







// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
	return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
	return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
	return 'assets/' + path;
});

module.exports.cssFileToInjectFakeProd = ['assets/styles/default.css']; 
module.exports.jsFileToInjectFakeProd = ['assets/bower_components/jquery/dist/jquery.min.js'];

var assets = jsFilesToInject.map(function(js){
  return 'assets/'+js;
});

module.exports.jsAssetsAngular = assets.filter(function(js){
  if(js.indexOf('assets/js') != 0)
    return true;
});
module.exports.jsAssets = assets.filter(function(js){
  if(js.indexOf('assets/js') == 0)
    return true;
});
