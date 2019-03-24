const formatName = name => name.replace(/[^A-Za-z0-9-.\s]/g, '');

const getTrackInfo = ({ url, filename }) => {
    const formattedName = formatName(filename);
    const extension = formattedName.includes('.') ? formattedName.split('.').pop() : '';

    return {
        url: `${url}${filename}`,
        name: formattedName.replace(`.${extension}`, ''),
        extension,
    };
};

module.exports = { formatName, getTrackInfo };
