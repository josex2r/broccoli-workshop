var eslint = require('broccoli-lint-eslint');
var compileES6 = require('broccoli-es6-concatenator');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var sass = require('broccoli-sass');
var myAwesomeLog = require('my-awesome-log');

// Copy static files
var publicTreeWithLog = new myAwesomeLog(['public'], {
    annotation: 'publicTree'
});

// Compile styles
var cssTreeWithLog = new myAwesomeLog(['styles'], {
    annotation: 'cssTree'
});
var cssTree = new sass([cssTreeWithLog], 'main.scss', 'application.css');

// Run eslint
var appTreeWithLog = new myAwesomeLog(['lib'], {
    annotation: 'appTree'
})

// Transpile es6 code & generate application.js file
var appTree = new compileES6(appTreeWithLog, {
    inputFiles: [
        '**/*.js'
    ],
    ignoredModules: [
      'loader'
    ],
    wrapInEval: false,
    loaderFile: 'loader.js',
    outputFile: '/application.js'
});

// Merge all trees
module.exports = mergeTrees([appTree, publicTreeWithLog, cssTree]);
