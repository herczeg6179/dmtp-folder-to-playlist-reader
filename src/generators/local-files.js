const { lstatSync, readdir } = require('fs');
const { join } = require('path');
const { getTrackInfo, formatName } = require('../helpers');

const isDirectory = source => lstatSync(source).isDirectory();

const getFilesByDirectory = directory =>
    new Promise((resolve, reject) =>
        readdir(directory, (error, files) =>
            error ? reject(error) : resolve(files.map(file => join(directory, file)))
        )
    );

const getSubDirectories = folder => getFilesByDirectory(folder).then(files => files.filter(file => isDirectory(file)));

const getSubdirectoryFiles = subdirectory =>
    getFilesByDirectory(subdirectory).then(files => files.filter(file => !isDirectory(file)));

const getAllDirectories = folder => getSubDirectories(folder);

const getAllFilelists = directories =>
    Promise.all(directories.map(directory => getSubdirectoryFiles(directory))).then(fileLists => ({
        directories,
        fileLists,
    }));

const fileListsToPlaylists = ({ directories, fileLists, folder, url }) =>
    directories.map((directory, index) => ({
        playlist: formatName(directory.replace(folder, '')),
        tracks: fileLists[index].map(file => getTrackInfo({ url, filename: file.replace(directory, '') })),
    }));

module.exports = ({ folder, url }) =>
    getAllDirectories(folder)
        .then(directories => getAllFilelists(directories))
        .then(({ directories, fileLists }) => fileListsToPlaylists({ directories, fileLists, folder, url }));
