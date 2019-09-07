'use strict';


const fs = require('fs');
const path = require('path');

let lib = {
    /**
     * Function that find the root path where grunt plugins are installed.
     *
     * @method findRoot
     * @return String rootPath
     */
    findRoot: function () {
        let cwd = process.cwd();
        let rootPath = cwd;
        let newRootPath = null;
        while (!fs.existsSync(path.join(process.cwd(), "node_modules/grunt"))) {
            process.chdir("..");
            newRootPath = process.cwd();
            if (newRootPath === rootPath) {
                return;
            }
            rootPath = newRootPath;
        }
        process.chdir(cwd);
        return rootPath;
    },
    /**
     * Function load the npm tasks from the root path
     *
     * @method loadTasks
     * @param grunt {Object} The grunt instance
     * @param tasks {Array} Array of tasks as string
     */
    loadTasks: function (grunt, rootPath, tasks) {
        tasks.forEach(function (name) {
            if (name === 'grunt-cli') return;
            let cwd = process.cwd();
            process.chdir(rootPath); // load files from proper root, I don't want to install everything locally per module!
            grunt.loadNpmTasks(name);
            process.chdir(cwd);
        });
    }
};

module.exports = function (grunt) {
    //Loading the needed plugins to run the grunt tasks
    let pluginsRootPath = lib.findRoot();
    lib.loadTasks(grunt, pluginsRootPath, ['grunt-contrib-jshint', 'grunt-jsdoc', 'grunt-contrib-clean', 'grunt-mocha-test', 'grunt-env', 'grunt-istanbul', 'grunt-coveralls', 'grunt-contrib-copy']);
    grunt.initConfig({
        //Defining jshint tasks
        jshint: {
            options: {
                "esversion": 6,
                "bitwise": true,
                "eqeqeq": true,
                "forin": true,
                "newcap": true,
                "noarg": true,
                "undef": true,
                "unused": false,
                "eqnull": true,
                "laxcomma": true,
                "loopfunc": true,
                "sub": true,
                "supernew": true,
                "validthis": true,
                "node": true,
                "maxerr": 100,
                "indent": 2,
                "globals": {
                    "describe": false,
                    "it": false,
                    "before": false,
                    "beforeEach": false,
                    "after": false,
                    "afterEach": false
                },
                ignores: ['test/coverage/**/*.js']
            },
            files: {
                src: ['index.js', 'config.js', 'bl/*.js', 'model/mongo/*.js', 'test/helper.js', 'test/unit/**/*.js', 'test/integration/**/*.js']
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },

        env: {
            mochaTest: {
                SOAJS_ENV: "dashboard",
                SOAJS_SRVIP: "127.0.0.1",
                SOAJS_TEST: true,
                APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/'
            },
            coverage: {
                SOAJS_ENV: "dashboard",
                SOAJS_SRVIP: "127.0.0.1",
                SOAJS_TEST: true,
                APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/'
            }
        },

        clean: {
            doc: {
                src: ['doc/']
            },
            coverage: {
                src: ['test/coverage/']
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, src: ['package.json'], dest: 'test/coverage/instrument/', filter: 'isFile'},
                    {
                        cwd: 'schemas/',  // set working folder / root to copy
                        src: '**/*',
                        dest: 'test/coverage/instrument/schemas',    // destination folder
                        expand: true           // required when using cwd
                    }
                ],
            }
        },


        instrument: {
            src: ['index.js', 'config.js', 'bl/*.js', 'model/mongo/*.js'],
            options: {
                lazy: false,
                basePath: 'test/coverage/instrument/'
            }
        },

        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },

        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'test/coverage/reports',
                print: 'detail'
            }
        },

        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec',
                    timeout: 90000
                },
                src: ['test/unit/index.js']
            },
            integration: {
                options: {
                    reporter: 'spec',
                    timeout: 90000
                },
                src: ['test/integration/index.js']
            }
        },

        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'test/coverage/reports/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },
            your_target: {
                // Target-specific LCOV coverage file
                src: 'test/coverage/reports/lcov.info'
            }
        }
    });

    process.env.SHOW_LOGS = grunt.option('showLogs');
    grunt.registerTask("default", ['jshint']);
    grunt.registerTask("integration", ['clean', 'copy', 'env:coverage', 'instrument', 'mochaTest:integration']);
    grunt.registerTask("unit", ['clean', 'copy', 'env:coverage', 'instrument', 'mochaTest:unit']);
    grunt.registerTask("test", ['clean', 'copy', 'env:coverage', 'instrument', 'mochaTest:unit', 'mochaTest:integration']);
    grunt.registerTask("coverage", ['clean', 'copy', 'env:coverage', 'instrument', 'mochaTest:unit', 'mochaTest:integration', 'storeCoverage', 'makeReport', 'coveralls']);

};

