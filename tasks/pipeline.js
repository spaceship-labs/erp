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
	'/bower_components/chosen/chosen/chosen.css',
	"/bower_components/ng-tags-input/ng-tags-input.min.css",

	'/styles/bootstrap-responsive.min.css',
	'/styles/default.css',

	'/styles/css/jquery.ui.css',
	'/styles/css/animate.min.css',
	'/styles/css/animate.delay.css',
	'/styles/css/isotope.css',
	'/styles/css/colorbox.css',
	'/styles/css/uniform.tp.css',
	'/styles/css/colorpicker.css',
	'/styles/css/jquery.jgrowl.css',
	'/styles/css/jquery.alerts.css',
	'/styles/css/jquery.tagsinput.css',
	'/styles/css/ui.spinner.css',
	'/styles/css/jquery.chosen.css',
	'/styles/css/fullcalendar.css',
	'/styles/css/bootstrap.css',
	'/styles/css/bootstrap-theme.min.css',
	'/styles/css/font-awesome.min.css',
	
	'styles/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

	// Dependencies like sails.io.js, jQuery, or Angular
	// are brought in here
	'/js/dependencies/**/*.js',
	'/bower_components/jquery/jquery.min.js',
    '/bower_components/jquery/dist/jquery.js',
    "/bower_components/modernizr/modernizr.js",
    "/bower_components/jquery-browser-detection/src/browser-detection.js",
	"/bower_components/bootstrap/dist/js/bootstrap.js",
	"/bower_components/angular/angular.js",
	"/bower_components/ng-file-upload/angular-file-upload.js",
	"/bower_components/chosen/chosen.jquery.js",
	"/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js",
	//"/bower_components/jquery-migrate/jquery-migrate.js",
	"/bower_components/jquery-ui/ui/minified/jquery-ui.js",
	"/bower_components/jquery-form/jquery.form.js",
	"/bower_components/jquery-cookie/jquery.cookie.js",
	"/bower_components/flot/jquery.flot.js",
	"/bower_components/flot/jquery.flot.resize.js",
	"/bower_components/ng-tags-input/ng-tags-input.js",
	"/bower_components/slimScroll/slimScroll.js",
	"/bower_components/angular-ui-sortable/sortable.js",
	"/js/themejs/*.js",
	"/js/*.js",
	'/js/directives/*.js',
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
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
