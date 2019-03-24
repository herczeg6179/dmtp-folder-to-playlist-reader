'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var helpers = require('./helpers');

module.exports = _extends({}, helpers, {
    generateByLocalFiles: require('./readers/local-files'),
    generateByS3Bucket: require('./readers/s3-bucket')
});