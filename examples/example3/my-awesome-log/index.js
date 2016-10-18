var Plugin = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var sync = require('symlink-or-copy').sync;
var rimraf = require('rimraf');
var arrayToTree = require('./array-to-tree.js');

MyAwesomeLog.prototype = Object.create(Plugin.prototype);

MyAwesomeLog.prototype.constructor = MyAwesomeLog;

function MyAwesomeLog(inputNodes, options) {
    if (!(this instanceof MyAwesomeLog)) return new MyAwesomeLog(inputTree, options);

    options = options || {};
    Plugin.call(this, inputNodes, {
        annotation: options.annotation
    });
    this.options = options;
}

MyAwesomeLog.prototype.build = function() {
    var outputPath = this.outputPath;
    var description = this.options.annotation;

    this.inputPaths.forEach(function(inputPath) {
        // Symlink files
        rimraf.sync(outputPath);
        sync(inputPath, outputPath);

        //Log files
        var files = walkSync(inputPath);
        var stdout = arrayToTree(files);

        console.log('################');
        console.log('## ' + description + ' ##');
        console.log('################');
        console.log(stdout);
    });
};

module.exports = MyAwesomeLog;
