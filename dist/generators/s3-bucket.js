"use strict";

// TODO: kind of a mess, maybe try a different approach with the listObjectsV2 result handling
// probably should instead
// map to add playlists names
// reduce a playlist list from all
// add tracks to playlists by filtering
/*
const AWS = require('aws-sdk/global');
const { formatName } = require('../helpers');

const MaxKeys = 1000; // TODO: handle pages

const isTrack = ({ Key }, Prefix) => Key.match(new RegExp(`${Prefix}\\/.*\\/.+`));

const s3Factory = config => {
    AWS.config.update(config);
    return new AWS.S3({ ...config, apiVersion: '2006-03-01' });
};

const objectListToPlaylists = ({ s3objectlist: { Contents, Prefix }, url }) =>
    Contents.reduce(
        (playlists, s3object) =>
            isTrack(s3object, Prefix)
                ? appendToPlaylists({ Prefix, prevPlaylists: playlists, s3object, url })
                : playlists,
        []
    );

const findPlaylist = (playlistToFind, playlists) => playlists.find(({ playlist }) => playlist === playlistToFind);

const findPlaylistIndex = (playlistToFind, playlists) =>
    playlists.findIndex(({ playlist }) => playlist === playlistToFind);

const getTrackInfo = ({ url, filename }) => {
    const formattedName = formatName(filename);
    const extension = formattedName.includes('.') ? formattedName.split('.').pop() : '';

    return {
        url,
        name: formattedName.replace(`.${extension}`, ''),
        extension,
    };
};

const initializePlaylist = (playlistToInit, playlists) =>
    !findPlaylist(playlistToInit, playlists) ? [...playlists, { playlist: playlistToInit, tracks: [] }] : playlists;

const appendToPlaylists = ({ Prefix, prevPlaylists, s3object: { Key }, url }) => {
    const keyParts = Key.replace(`${Prefix}/`, '').split('/');
    const playlist = keyParts.shift();
    const filename = keyParts.join('/');

    const nextPlaylists = initializePlaylist(playlist, prevPlaylists);
    const playlistIndex = findPlaylistIndex(playlist, nextPlaylists);

    nextPlaylists[playlistIndex].tracks = appendTrack(
        getTrackInfo({ url: `${url}${Key}`, filename }),
        nextPlaylists[playlistIndex].tracks
    );
    return nextPlaylists;
};

const appendTrack = (track, tracks) => [...tracks, track];

const s3BucketToPLaylists = ({ S3Config, Bucket, folder, url }) => {
    const s3 = s3Factory(S3Config);

    return new Promise((resolve, reject) => {
        s3.listObjectsV2({ Bucket, MaxKeys, Prefix: folder }, (error, s3Response) =>
            error ? reject(error) : resolve(s3Response)
        );
    }).then(s3objectlist => objectListToPlaylists({ s3objectlist, url }));
};

module.exports = { s3BucketToPLaylists };
*/

module.exports = {};