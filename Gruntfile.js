module.exports = function (grunt) {

  var srcFiles = [
    'src/nextphysics/intro.js',
    'src/nextphysics/util/*.js',
    'src/nextphysics/NextPhysics.js',
    'src/nextphysics/npengine/*.js',
    'src/nextphysics/npengine/force/*.js',
    'src/nextphysics/npobjects/*.js',
    'src/nextphysics/npobjects/core/*.js',
    'src/nextphysics/npobjects/sample/*.js',
    'src/nextphysics/nprenderer/*.js',
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        src: ['bin/*']
      }
    },

    concat: {
      dist: {
        src: srcFiles,
        dest: 'bin/nextphysics.dev.js'
      }
    },

    uglify: {
      build: {
        options: {
          beautify: true
        },
        files: {
          'bin/npengine.js': ['bin/nextphysics.dev.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask(
      'build',
      'Compiles all of the assets and copies the files to the build directory.',
      ['clean', 'concat', 'uglify']
  );
};
