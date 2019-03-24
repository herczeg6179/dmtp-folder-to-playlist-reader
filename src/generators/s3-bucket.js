const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
const { getTrackInfo } = require('../helpers');

const MaxKeys = 1000; // TODO: handle pages

const isTrack = ({ Key, Size }, folder) => Size > 0 && Key.match(new RegExp(`${folder}\\/.*\\/.+`));

const getPlaylistName = ({ Key }, folder) =>
    Key.replace(`${folder}/`, '')
        .split('/')
        .shift();

const getBucketUrl = ({ Bucket, url }) => `${url}/${Bucket}`;

const getFilename = ({ Key, playlist }, folder) => Key.replace(`${folder}/${playlist}`, '');

const getFileUrl = ({ Key }, bucketUrl) => `${bucketUrl}/${Key}`;

const s3Factory = config => {
    AWS.config.update(config);
    return new S3({ ...config, apiVersion: '2006-03-01' });
};

const uniquePlaylistNameReducer = (uniquePlaylists, { playlist }) =>
    uniquePlaylists.includes(playlist) ? uniquePlaylists : uniquePlaylists.concat(playlist);

const initializePlaylist = (playlistName, tracklist) => ({
    playlist: playlistName,
    tracks: tracklist
        .filter(track => track.playlist === playlistName)
        .map(track => {
            delete track.playlist; // can get rid fo it now, though would love a better way for this...
            return { ...track };
        }),
});

const getS3FolderContent = ({ S3Config, Bucket, Prefix }) =>
    new Promise((resolve, reject) => {
        s3Factory(S3Config).listObjectsV2({ Bucket, MaxKeys, Prefix }, (error, s3Response) =>
            error ? reject(error) : resolve(s3Response)
        );
    });

const filterS3ResultToTracks = ({ folder }) => s3ObjectList =>
    s3ObjectList.Contents.filter(s3Object => isTrack(s3Object, folder));

const transformS3ObjectsToTracks = ({ folder, bucketUrl }) => s3ObjectList =>
    s3ObjectList.map(s3Object => ({
        ...getTrackInfo({ filename: getFilename(s3Object, folder), url: getFileUrl(s3Object, bucketUrl) }),
        playlist: s3Object.playlist, // we need to keep this around for the reduce
    }));

const addPlaylistNames = ({ folder }) => s3ObjectList =>
    s3ObjectList.map(s3Object => ({
        ...s3Object,
        playlist: getPlaylistName(s3Object, folder),
    }));

const createPlaylists = () => tracklist =>
    tracklist.reduce(uniquePlaylistNameReducer, []).map(playlistName => initializePlaylist(playlistName, tracklist));

module.exports = ({ S3Config, Bucket, folder, url }) =>
    getS3FolderContent({ S3Config, Bucket, Prefix: folder })
        .then(filterS3ResultToTracks({ folder }))
        .then(addPlaylistNames({ folder }))
        .then(transformS3ObjectsToTracks({ folder, bucketUrl: getBucketUrl({ Bucket, url }) }))
        .then(createPlaylists());
