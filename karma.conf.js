var pipeline = require('./tasks/pipeline');
pipeline.jsAssetsAngular = pipeline.jsAssetsAngular.concat(['assets/templates/partials/*.html','assets/bower_components/angular-mocks/angular-mocks.js']);
pipeline.jsAssets.push('test/frontend/**/*.js');
var js = pipeline.jsAssetsAngular.concat(pipeline.jsAssets);

module.exports = function(config){
  config.set({

    basePath : './',

    files : js,

    preprocessors: {
        'assets/templates/partials/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: 'assets',
    },

    autoWatch : true,

    frameworks: ['mocha', 'chai'],

    browsers : ['Chrome'],
    
    
    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-chai',
            'karma-junit-reporter',
            'ng-html2js',
            'karma-ng-html2js-preprocessor'
            ],
    

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
