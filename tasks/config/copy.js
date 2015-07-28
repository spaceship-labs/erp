/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {

	console.log('theme', process.env.ERPTHEME);
	var erpTheme = process.env.ERPTHEME || 'default';
	grunt.config.set('copy', {
		dev: {
			files: [{
				expand: true,
				cwd: './assets',
				src: ['**/*.!(coffee|less)'],
				dest: '.tmp/public'
			}]
		},
		build: {
			files: [{
				expand: true,
				cwd: '.tmp/public',
				src: ['**/*'],
				dest: 'www'
			}]
		},
		theme:{
			files: [{
				src: 'assets/styles/custom/'+erpTheme+'.less',
				dest: 'assets/styles/custom/select.less',

				nonull: true
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
