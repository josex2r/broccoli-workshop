var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var sync = require('symlink-or-copy').sync;
var rimraf = require('rimraf');
var arrayToTree = require('./array-to-tree.js');

MyAwesomeLog.prototype = Object.create(Plugin.prototype);

MyAwesomeLog.prototype.constructor = MyAwesomeLog;

function MyAwesomeLog(inputNode, options) {
    if (!(this instanceof MyAwesomeLog)) return new MyAwesomeLog(inputTree, options);

    options = options || {};
    Plugin.call(this, [inputNode], {
        annotation: options.annotation
    });
    this.options = options;
}

MyAwesomeLog.prototype.build = function() {
    var outputPath = this.outputPath;

    this.inputPaths.forEach(function(inputPath) {
        // Symlink files
        rimraf.sync(outputPath);
        sync(inputPath, outputPath);

        //Log files
        var files = walkSync(inputPath);
        var stdout = arrayToTree(files);

        console.log('#####################');
        console.log('## My Awesome Log! ##');
        console.log('#####################');
        console.log(stdout);
    });
};

module.exports = MyAwesomeLog;
