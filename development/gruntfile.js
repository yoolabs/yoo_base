
module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	pkg.banner = '/*! \n ' +
	' * @package    <%= name %>\n' +
	' * @version    <%= version %>\n' +
	' * @date       <%= grunt.template.today("yyyy-mm-dd") %>\n' +
	' * @author     <%= author %>\n' +
	' * @copyright  Copyright (c) <%= grunt.template.today("yyyy") %> <%= copyright %>\n' +
	' */\n';

	pkg.banner = grunt.template.process(pkg.banner, {data: pkg});

	pkg.phpbanner = pkg.banner + "\n defined('_JEXEC') or die; \n";

	grunt.template.addDelimiters('source-code-safe', '___', '___')
	grunt.template.addDelimiters('source-code-safe2', '[%', '%]')

	// pkg.minify = '.min';
	// var fileVars = pkg;

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: pkg,

		// Metadata.
		meta: {
			srcPath: '',
			jsPath: 'js/',
			buildPath: '../build/',
			stagePath: '../staging/'
		},

		banner: pkg.banner,

	    clean: {
		    deployDir: {
				src: ['<%= meta.buildPath %>source/**/*'],
				options: {
					force: true // force cleanup outside of cwd
				}
		    }
	    },

		copy: {
			template: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= meta.srcPath %>template/',
						dest: '<%= meta.buildPath %>source/<%= pkg.name %>/',
						src: [
							'**/*'
						],
						// rename: function(dest, src) {
						// 	return dest + src.replace('%id%',pkg.id).replace('%name%',pkg.name);
						// }
					},
				],
				options: {
					process: function(content,srcPath) {
						if(grunt.file.match('**/*.{js,json,css,less,html,php,xml}', srcPath)) {
							// dirty solution: within the delimiters there has to be a equal sign to load variables.
							// insert it via regex operation.
							content = content.replace(/#?___(.*?)___;?/g,function(fullMatch,inner,something,fileContents,sourcePath,targetPath) {
								return "___="+inner+"___";
							})
							const tmp = grunt.template.process(content, {data: pkg, delimiters:'source-code-safe'});
							return grunt.template.process(tmp, {data: pkg, delimiters:'source-code-safe2'});
						} else {
							return content;
						}
					},
					noProcess: ['**/*.{png,gif,jpg,ico,psd,eot,ttf,woff,woff2,otf}'] // processing would corrupt image files.
				}
			},
			// @TODO not working right now
			staging: {
				files: [
					{
						expand: true,
						dot: true,
						src: [ '**/*.*' ],
						cwd: '<%= meta.buildPath %>source/<%= pkg.name %>',
						dest: '<%= meta.stagePath %>templates/<%= pkg.name %>',
					}
				]
			}
		},

		compress: {
			template: {
				options: {
					mode: 'zip',
					archive: '<%= meta.buildPath %><%= pkg.name %>-<%= pkg.version %>.zip'
				},
				files: [{
					cwd: '<%= meta.buildPath %>source/<%= pkg.name %>/',
					src: ['**/*'],
					// dest: '/',
					expand: true
				}]
			},
		},

		watch: {
			stage : {
				// don't include all dirs as this would include node_modules too!
				// or use !**/node_modules/** to exclude dir
				files: ['<%= meta.srcPath %>template/**/*'],
				tasks: ['clean:deployDir' , 'copy:template', 'copy:staging']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task
	// grunt.registerTask('default', [ 'copy' ]);
	grunt.registerTask('release', [ 'clean:deployDir' , 'copy:template' , 'compress:template']);
	grunt.registerTask('build', [ 'clean:deployDir' , 'copy:template' , 'compress:template']);
	grunt.registerTask('stage', [ 'clean:deployDir' , 'copy:template' , 'copy:staging' ]);
	grunt.registerTask('default', function() {
		console.log('Choose one of the registered tasks:');
		console.log('build / release - compile template and create a zip file');
		console.log('stage / watch:stage - compile template and copy to stage');
	});

};
