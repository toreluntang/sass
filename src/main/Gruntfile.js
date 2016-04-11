module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Task Configuration:
        /**
         * Annotate files
         */
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    'min-safe/js/app.annotated.js': 'src/js/angular/**/*.js'
                }
            }
        },
        /**
         * Concat setup remember to include ngAnnotated files
         */
        concat: {
            options : {
                sourceMap : true,
            },
            vendors : {
                src : [               
                    'bower_components/lodash/lodash.js',    
                    'bower_components/jquery/dist/jquery.js',  
                    'bower_components/angular/angular.js',
                    // 'bower_components/hawk/browser.js',
                    'bower_components/angular-animate/angular-animate.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.js',
                ],
                dest : 'webapp/concat/vendors.js',
                nonull : true
            },
            app: {
                src: [
                    'src/js/angular-open.js',
                    'min-safe/js/app.annotated.js',
                    'src/js/angular-close.js'
                    
                ],
                dest: 'webapp/concat/site.js',
                nonull : true
            },
        },
        /**
         * Uglify setup
         */
        uglify: {
            vendors: {
                files: {
                    'webapp/concat/vendors.min.js': 'webapp/concat/vendors.js'
                }
            },
            site: {
                files: {
                    'webapp/concat/site.min.js': 'webapp/concat/site.js'
                }
            }
        },

        /**
         * SASS setup
         */
        sass: {
            dist: {
                options: {
                    loadPath: [
                        '',
                        ''
                    ],
                    banner: '/*SASS Frontend part -- sass setup*/',
                    style: 'expanded'
                },
                files: {
                    'webapp/style.css': 'src/sass/style.scss'
                }
            },
        },
        cssmin: {
            target: {
                files: {
                    'webapp/style.min.css': 'webapp/style.css'
                }
            }
        },
        /**
         * Notify setup
         */
        notify_hooks: {
            options: {
                enabled: true,
                title: "SASS Frontend" 
            }
        },
        notify: {
            js: {
                options: {
                    message: 'JS build',
                }
            },
            css: {
                options: {
                    message: 'CSS build',
                }
            },
            templates: {
                options: {
                    message: 'Templates/ views build',
                }
            }
        },
        /**
         * Watch setup
         */
        watch: {
            jsfiles : {
                options : {
                    livereload : 35729
                },
                files: ['src/js/**/*.js'],
                tasks: ['js_build']
            },
            sassfiles : {
                options : {
                    livereload : 35729
                },
                files: ['src/sass/*'],
                tasks: ['css_build']
            },
            templatefiles: {
                options : {
                    livereload : 35729
                },
                files: ['src/views/**'],
                tasks: ['template_build']
            }
        },
        /**
         * Copy files from src to app, the final destination
         */
        copy: {
            views: {
                cwd: 'src/views', 
                src: [
                  '**/*'
                ],
                dest: 'webapp/views',
                expand: true
            },
            assets: {
                cwd: 'src/assets', 
                src: [
                  '**/*'
                ],
                dest: 'webapp/assets',
                expand: true
            },
            css: {
                cwd: 'src/sass', 
                src: [
                  '**/*'
                ],
                dest: 'webapp/css',
                expand: true
            },
        },
    });

    // load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate'); 
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-notify');

    // register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);

    grunt.registerTask('template_build', [
        'copy:views',
        'notify:templates'
    ]);
    // Clean
    grunt.registerTask("clean", "clean build folder", function() {    
        grunt.file.delete('min-safe');
    });

    grunt.registerTask('js_build', [
        'ngAnnotate', 
        'concat:app',
        'uglify:site',
        'notify:js'
    ]);
    grunt.registerTask('css_build', [
        'copy:assets',
        'copy:css',
        // 'sass',
        'cssmin',
        'notify:css'
    ]);
}