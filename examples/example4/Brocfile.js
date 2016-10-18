var compileES6 = require('broccoli-es6-concatenator');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var sass = require('broccoli-sass');
var log = require('broccoli-stew').log;
var find = require('broccoli-stew').find;
var beforeBuild = require('broccoli-stew').beforeBuild;
var afterBuild = require('broccoli-stew').afterBuild;
var rm = require('broccoli-stew').rm;

// Copy static files
var publicTree = 'public';

// Compile styles
var cssTree = new sass(['styles'], 'main.scss', 'application.css');

// Remove exception file
var appTree = rm('lib', 'exception.js');

// Transpile es6 code & generate application.js file
appTree = new compileES6(appTree, {
    inputFiles: [
        '**/*'
    ],
    ignoredModules: [
      'loader'
    ],
    wrapInEval: false,
    loaderFile: 'loader.js',
    outputFile: '/application.js'
});

// Write a message before transpile es6 code
appTree = beforeBuild(appTree, function(output) {
    console.log('\n', '[beforeBuild]', '\n');
});

// Log eslint files
appTree = log(appTree, { output: 'tree', label: 'eslint tree' });

// Write a message after transpile es6 code
appTree = afterBuild(appTree, function(output) {
    console.log('\n', '[afterBuild]', 'output path:', output, '\n');
});

// Check if we are including a hidden system file in the public tree (.gitignore)
var test = log(find(publicTree, '.*', { overwrite: true }));

// Merge all trees
module.exports = mergeTrees([appTree, publicTree, cssTree, test]);
