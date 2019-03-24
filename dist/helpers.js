'use strict';

var formatName = function formatName(name) {
    return name.replace(/[^A-Za-z0-9-.\s]/g, '');
};

var getTrackInfo = function getTrackInfo(_ref) {
    var url = _ref.url,
        filename = _ref.filename;

    var formattedName = formatName(filename);
    var extension = formattedName.includes('.') ? formattedName.split('.').pop() : '';

    return {
        url: '' + url + filename,
        name: formattedName.replace('.' + extension, ''),
        extension: extension
    };
};

module.exports = { formatName: formatName, getTrackInfo: getTrackInfo };