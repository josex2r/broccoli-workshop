var eslint = require('broccoli-lint-eslint');
var compileES6 = require('broccoli-es6-concatenator');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var sass = require('broccoli-sass');

// Copy static files
var publicTree = 'public';

// Compile styles
var cssTree = new sass(['styles'], 'main.scss', 'application.css');

// Run eslint
var lintTree = new eslint('lib');

// Transpile es6 code & generate application.js file
var appTree = new compileES6(lintTree, {
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
module.exports = mergeTrees([appTree, publicTree, cssTree]);
