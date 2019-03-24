const helpers = require('./helpers');

module.exports = {
    ...helpers,
    generateByLocalFiles: require('./readers/local-files'),
    generateByS3Bucket: require('./readers/s3-bucket'),
};
