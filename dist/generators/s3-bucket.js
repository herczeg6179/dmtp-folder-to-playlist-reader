'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var AWS = require('aws-sdk/global');
var S3 = require('aws-sdk/clients/s3');

var _require = require('../helpers'),
    getTrackInfo = _require.getTrackInfo;

var MaxKeys = 1000; // TODO: handle pages

var isTrack = function isTrack(_ref, folder) {
    var Key = _ref.Key,
        Size = _ref.Size;
    return Size > 0 && Key.match(new RegExp(folder + '\\/.*\\/.+'));
};

var getPlaylistName = function getPlaylistName(_ref2, folder) {
    var Key = _ref2.Key;
    return Key.replace(folder + '/', '').split('/').shift();
};

var getBucketUrl = function getBucketUrl(_ref3) {
    var Bucket = _ref3.Bucket,
        url = _ref3.url;
    return url + '/' + Bucket;
};

var getFilename = function getFilename(_ref4, folder) {
    var Key = _ref4.Key,
        playlist = _ref4.playlist;
    return Key.replace(folder + '/' + playlist, '');
};

var getFileUrl = function getFileUrl(_ref5, bucketUrl) {
    var Key = _ref5.Key;
    return bucketUrl + '/' + Key;
};

var s3Factory = function s3Factory(config) {
    AWS.config.update(config);
    return new S3(_extends({}, config, { apiVersion: '2006-03-01' }));
};

var uniquePlaylistNameReducer = function uniquePlaylistNameReducer(uniquePlaylists, _ref6) {
    var playlist = _ref6.playlist;
    return uniquePlaylists.includes(playlist) ? uniquePlaylists : uniquePlaylists.concat(playlist);
};

var initializePlaylist = function initializePlaylist(playlistName, tracklist) {
    return {
        playlist: playlistName,
        tracks: tracklist.filter(function (track) {
            return track.playlist === playlistName;
        }).map(function (track) {
            delete track.playlist; // can get rid fo it now, though would love a better way for this...
            return _extends({}, track);
        })
    };
};

var getS3FolderContent = function getS3FolderContent(_ref7) {
    var S3Config = _ref7.S3Config,
        Bucket = _ref7.Bucket,
        Prefix = _ref7.Prefix;
    return new Promise(function (resolve, reject) {
        s3Factory(S3Config).listObjectsV2({ Bucket: Bucket, MaxKeys: MaxKeys, Prefix: Prefix }, function (error, s3Response) {
            return error ? reject(error) : resolve(s3Response);
        });
    });
};

var filterS3ResultToTracks = function filterS3ResultToTracks(_ref8) {
    var folder = _ref8.folder;
    return function (s3ObjectList) {
        return s3ObjectList.Contents.filter(function (s3Object) {
            return isTrack(s3Object, folder);
        });
    };
};

var transformS3ObjectsToTracks = function transformS3ObjectsToTracks(_ref9) {
    var folder = _ref9.folder,
        bucketUrl = _ref9.bucketUrl;
    return function (s3ObjectList) {
        return s3ObjectList.map(function (s3Object) {
            return _extends({}, getTrackInfo({ filename: getFilename(s3Object, folder), url: getFileUrl(s3Object, bucketUrl) }), {
                playlist: s3Object.playlist // we need to keep this around for the reduce
            });
        });
    };
};

var addPlaylistNames = function addPlaylistNames(_ref10) {
    var folder = _ref10.folder;
    return function (s3ObjectList) {
        return s3ObjectList.map(function (s3Object) {
            return _extends({}, s3Object, {
                playlist: getPlaylistName(s3Object, folder)
            });
        });
    };
};

var createPlaylists = function createPlaylists() {
    return function (tracklist) {
        return tracklist.reduce(uniquePlaylistNameReducer, []).map(function (playlistName) {
            return initializePlaylist(playlistName, tracklist);
        });
    };
};

module.exports = function (_ref11) {
    var S3Config = _ref11.S3Config,
        Bucket = _ref11.Bucket,
        folder = _ref11.folder,
        url = _ref11.url;
    return getS3FolderContent({ S3Config: S3Config, Bucket: Bucket, Prefix: folder }).then(filterS3ResultToTracks({ folder: folder })).then(addPlaylistNames({ folder: folder })).then(transformS3ObjectsToTracks({ folder: folder, bucketUrl: getBucketUrl({ Bucket: Bucket, url: url }) })).then(createPlaylists());
};