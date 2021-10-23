module.exports = function(grunt) {

	grunt.initConfig({

		/***************************************/
		/************ CONFIGURATION ************/
		/***************************************/

		pkg: grunt.file.readJSON("package.json"),
		config: {
			build : 'examples/scripts',
			dist : 'dist'
		},
		path : '<%= config[process.argv[2]] %>', // process.argv[2] = current Grunt overall task. Like default, build, etc. Not sub tasks like uglify.

		/***************************************/
		/************* COMMON TASKS ************/
		/***************************************/

		/**** REMOVE OLD CONTENT ****/

		clean: {
			options: {
				force: true
			},
			files: [
				'<%= path %>/**/**/**'
			]
		},

		/**** COPY ALL FILES ****/

		copy: {
			build: {
				expand: true,
				cwd: 'src',
				src: [
					'**/*',
				],
				dest: '<%= path %>'
			},
			dist: {
				expand: true,
				cwd: 'src',
				src: [
					'**/*',
				],
				dest: '<%= path %>',
				rename: function(dest, src) {
					return '<%= path %>/' + src.replace('simpler-inputs','simpler-inputs-' + '<%= pkg.version %>');
				}
			}
		},

		/**** PROCESS JS ****/

		terser: {
			scripts : {
				options: {
					compress: {
						drop_console: false
					}
				},
				files: {
					//'<%= path %>/classes.min.js': [ '<%= path %>/classes.js' ], ... THIS GETS FILLED IN FROM THE CUSTOM build-terser-file-list TASK
				},
				src : [
					'<%= path %>/*.js'
				]
			}
		},

		/**** WATCH FOR CHANGES TO SOURCE FILES AND RERUN BUILD TASKS ****/

		watch: {
			scripts: {
				files: ['src/**/**/*'],
				tasks: ['copy:build', 'uglify'],
				options: {
					spawn: false,
				},
			} 
		},
	});

	grunt.registerTask('build-terser-file-list', function () {

		// read the terser config
		var terser_config = grunt.config.get('terser') || {};
		var terser_target_config = terser_config['scripts'] || {};

		// loop through all source files and create an entry in the terser config for each of it
		var files = grunt.file.expand(terser_target_config.src);
		for (const [i, filePath] of files.entries()) {
			terser_target_config.files[filePath.replace('.js','.min.js')] = filePath;
		}

		delete terser_target_config.src;

		// write back config and run task
		grunt.config.set('terser', terser_config);

	});

	// 2. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('@miraries/grunt-terser');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('build', ['copy:build', 'build-terser-file-list', 'terser', 'watch']);
	grunt.registerTask('dist', ['clean', 'copy:dist', 'build-terser-file-list', 'terser']);


};
