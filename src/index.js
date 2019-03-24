const helpers = require('./helpers');

module.exports = {
    ...helpers,
    generateByLocalFiles: require('./generators/local-files'),
    generateByS3Bucket: require('./generators/s3-bucket'),
};
