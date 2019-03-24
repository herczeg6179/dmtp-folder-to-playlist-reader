'use strict';

var _require = require('fs'),
    lstatSync = _require.lstatSync,
    readdir = _require.readdir;

var _require2 = require('path'),
    join = _require2.join;

var _require3 = require('../helpers'),
    getTrackInfo = _require3.getTrackInfo,
    formatName = _require3.formatName;

var isDirectory = function isDirectory(source) {
    return lstatSync(source).isDirectory();
};

var getFilesByDirectory = function getFilesByDirectory(directory) {
    return new Promise(function (resolve, reject) {
        return readdir(directory, function (error, files) {
            return error ? reject(error) : resolve(files.map(function (file) {
                return join(directory, file);
            }));
        });
    });
};

var getSubDirectories = function getSubDirectories(folder) {
    return getFilesByDirectory(folder).then(function (files) {
        return files.filter(function (file) {
            return isDirectory(file);
        });
    });
};

var getSubdirectoryFiles = function getSubdirectoryFiles(subdirectory) {
    return getFilesByDirectory(subdirectory).then(function (files) {
        return files.filter(function (file) {
            return !isDirectory(file);
        });
    });
};

var getAllDirectories = function getAllDirectories(folder) {
    return getSubDirectories(folder);
};

var getAllFilelists = function getAllFilelists(directories) {
    return Promise.all(directories.map(function (directory) {
        return getSubdirectoryFiles(directory);
    })).then(function (fileLists) {
        return {
            directories: directories,
            fileLists: fileLists
        };
    });
};

var fileListsToPlaylists = function fileListsToPlaylists(_ref) {
    var directories = _ref.directories,
        fileLists = _ref.fileLists,
        folder = _ref.folder,
        url = _ref.url;
    return directories.map(function (directory, index) {
        return {
            playlist: formatName(directory.replace(folder, '')),
            tracks: fileLists[index].map(function (file) {
                return getTrackInfo({ url: url, filename: file.replace(directory, '') });
            })
        };
    });
};

module.exports = function (_ref2) {
    var folder = _ref2.folder,
        url = _ref2.url;
    return getAllDirectories(folder).then(function (directories) {
        return getAllFilelists(directories);
    }).then(function (_ref3) {
        var directories = _ref3.directories,
            fileLists = _ref3.fileLists;
        return fileListsToPlaylists({ directories: directories, fileLists: fileLists, folder: folder, url: url });
    });
};