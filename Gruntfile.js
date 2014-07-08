module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    timestamp: new Date().getTime(),
    db_config: grunt.file.readJSON('config/staging.json'),
    deployments: {
      "options": {},
      "local": {
        "title": "localhost",
        "database": "hsqs",
        "user": "root",
        "pass": "",
        "host": "127.0.0.1",
        "url": ""
      },
      "staging": {
        "title": "HSQS",
        "database": "<%= db_config.db.db_name %>",
        "user": "<%= db_config.db.username %>",
        "pass": "<%= db_config.db.password %>",
        "host": "<%= db_config.db.host %>",
        "ssh_host": "dmiddleton@lsinthsqs02.wgbh.org"
      },
      "production": {
        "title": "HSQS",
        "database": "<%= db_config.db.db_name %>",
        "user": "<%= db_config.db.username %>",
        "pass": "<%= db_config.db.password %>",
        "host": "<%= db_config.db.host %>",
        "ssh_host": "dmiddleton@192.168.40.16"
      }
    },
    clean: ["dist/", "archive/"],

    jshint: ["app/modules/**/*.js", "models/**"],

    copy: {
      release: {
        files: [
          { src: ["app/**"], dest: "dist/" },
          { src: "static/js/vendor/bower/**", dest: "dist/" }
        ]
      }
    },

    connect: {
      server: {
        options: {
          port: 5000,
          base: "dist/"
        }
      }
    },

    watch: {
      livereload: {
        files: ["dist/**/*"],
        //files: "dist/static/css/*.css",
        options: { livereload: 1337 }
      },
      stylesheets: {
        files: "app/scss/**/*",
        tasks: "compass:dev"
      },
      scripts: {
        files: ["static/js/**/*.js"],
        tasks: ["jshint"]
      },
      dev: {
        files: ["templates/**/*", "data/*"],
        tasks: ["assemble"]
      }
    },

    compass: {
      dev: {
        options: {
          environment: "dev",
          sassDir: 'app/scss',
          cssDir: 'dist/static/css',
          raw: 'require "breakpoint"'
        }
      },
      dist: {
        options: { environment: "production" }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          compass: true
        },
        files: [{
          expand: true,
          cwd: 'dist/static/css',
          src: ['*.css'],
          dest: 'dist/static/css/<%= pkg.version %>',
          ext: '-build-<%= timestamp %>.css'
        }]
      }
    },

    requirejs: {
      release: {
        options: {
          mainConfigFile: "app/config.js",
          generateSourceMaps: true,
          include: ["main"],
          out: "dist/source.min.js",
          optimize: "uglify2",

          // Since we bootstrap with nested `require` calls this option allows
          // R.js to find them.
          findNestedDependencies: true,

          // Include a minimal AMD implementation shim.
          name: "almond",

          // Setting the base url to the distribution directory allows the
          // Uglify minification process to correctly map paths for Source
          // Maps.
          baseUrl: "dist/app",

          // Wrap everything in an IIFE.
          wrap: true,

          // Do not preserve any license comments when working with source
          // maps.  These options are incompatible.
          preserveLicenseComments: false
        }
      }
    },

    assemble: {
      options: {
        pkg: '<%= pkg %>',
        flatten: true,
        layoutdir: "templates/layouts",
        //layout: "index.hbs",
        partials: "templates/partials/*.hbs",
        data: ['data/**/*.yml']
      },
      pages: {
        files: {
          "dist/": ["templates/pages/*.hbs"]
        }
      },
      dist: {
        options: {
          production: true,
          version: "<%= pkg.version %>",
          timestamp: '<%= timestamp %>',
          modernizr: function(){
            if( grunt.file.exists('dist/static/js/vendor/modernizr/modernizr.js')){
              return grunt.file.read('dist/static/js/vendor/modernizr/modernizr.js');
            }
          },
          basicCSS: function(){
            if( grunt.file.exists('dist/static/css/basic.css')){
              return grunt.file.read('dist/static/css/basic.css');
            }
          }
        },
        files: {
          "dist/": ["templates/pages/*.hbs"]
        }
      },
      dev: {
        options: {
          production: false
        },
        files: {
          "dist/": ["templates/pages/*.hbs"]
        }
      }
    },

    compress: {
      release: {
        options: {
          archive: "archive/site-<%= pkg.version %>.min.zip"
        },
        files: [
          { src: ['dist/**'], filter: 'isFile' }
        ]
      }
    },

    bumpup: {
      files: ["package.json", "bower.json"],
      options: {
        updateProps: {
          pkg: "package.json"
        }
      },
      setters: {
        timestamp: function(old, releaseType, options){
          return +new Date();
        }
      }
    },

    uglify: {
      files: {
        cwd: 'dist/static/js',
        expand: true,
        src: ['libs/*.js', 'vendor/**/*.js', '*.js'],
        dest: 'dist/static/js'
      }
    },

    imagemin: {
      crush: {
        files: [{
          expand: true,
          cwd: "static/images",
          src: ['**/*.{png,jpg,gif}'],
          dest: "dist/static/images"
        }]
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          args: ['dev'],
          ignoredFiles: ['node_modules/**'],
          watchedExtensions: ['js'],
          delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: '3000'
          },
          cwd: __dirname
        }
      },

      exec: {
        options: {
          exec: 'less'
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-deployments');

  // Release cleans out the dist folder and re-puts everything in there
  grunt.registerTask( "dev", ["jshint",
                              "clean",
                              "copy",
                              "compass:dev",
                              "concurrent:dev"] );

  grunt.registerTask( "test", ["jshint", "clean", "copy", "requirejs", "imagemin:crush", "compass:dist", "sass:dist", "connect"] );
  grunt.registerTask( "release", [
    "jshint",
    "clean",
    "copy",
    "requirejs",
    "imagemin:crush",
    "compass:dist",
    "sass:dist",
    //"uglify",
    "concurrent:dev",
    "compress:release"
  ]);
  grunt.registerTask( "default", "dev");
  grunt.registerTask('deploy', ['deployments']);
  grunt.registerTask( "release:bump-patch", ["bumpup:patch", "release"]);
  grunt.registerTask( "release:bump-minor", ["bumpup:minor", "release"]);
  grunt.registerTask( "release:bump-major", ["bumpup:major", "release"]);
};
