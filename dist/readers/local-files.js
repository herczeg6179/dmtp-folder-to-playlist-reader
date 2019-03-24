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

var addFilelistsToDirectories = function addFilelistsToDirectories() {
    return function (directories) {
        return Promise.all(directories.map(function (directory) {
            return getSubdirectoryFiles(directory);
        })).then(function (fileLists) {
            return {
                directories: directories,
                fileLists: fileLists
            };
        });
    };
};

var convertToPlaylists = function convertToPlaylists(_ref) {
    var folder = _ref.folder,
        url = _ref.url;
    return function (_ref2) {
        var directories = _ref2.directories,
            fileLists = _ref2.fileLists;
        return directories.map(function (directory, index) {
            return {
                playlist: formatName(directory.replace(folder, '')),
                tracks: fileLists[index].map(function (file) {
                    return getTrackInfo({ url: url, filename: file.replace(directory, '') });
                })
            };
        });
    };
};

module.exports = function (_ref3) {
    var folder = _ref3.folder,
        url = _ref3.url;
    return getAllDirectories(folder).then(addFilelistsToDirectories()).then(convertToPlaylists({ folder: folder, url: url }));
};