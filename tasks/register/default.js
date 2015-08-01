module.exports = function (grunt) {
	grunt.registerTask('default', ['copy:theme','compileAssets', 'linkAssets',  'watch']);
};
