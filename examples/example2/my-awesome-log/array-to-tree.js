function tab(size) {
    var _tab = '   ';
    return new Array(size).join(_tab);
}

var DIR_REGEX  = /\/$/,
    end = '└── ',
    ls = '├── ',
    newLine = '\n',
    stdout = '';

module.exports = function(array) {
    array.forEach(function(path, i, arr) {
        var depth = path.split('/').length;

        if (DIR_REGEX.test(path)) {
          stdout += (newLine + tab(depth - 1) + end + path);
        } else {
          stdout += (newLine + tab(depth));
          if (DIR_REGEX.test(arr[i + 1]) || i === (arr.length - 1)) {
            stdout += (end + path);
          } else {
            stdout += (ls + path);
          }
        }

        return path;
    });

    return stdout;
};
