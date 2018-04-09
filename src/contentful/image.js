const contentfulManagement = require('contentful-management');
const contentful = require('contentful');

const manageClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
});

const deliveryClient = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN
});

module.exports.uploadImage = async (data, file) => {
    try {
        const space = await manageClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const image = {
            fields: {
                title: {
                  'en-GB': data.title
                },
                description: {
                  'en-GB': data.description
                },
                file: {
                  'en-GB': {
                    contentType: file.mimetype,
                    fileName: file.originalname,
                    file: file.buffer
                  }
                }
            }
        }
        const asset = await space.createAssetFromFiles(image);
        const processAsset = await asset.processForAllLocales();
        const publishAsset = await processAsset.publish();
        return publishAsset;
    } catch (err) {
        console.log("error uploading contentful image: %s", err);
    }
}

module.exports.getImagesOfUser = async id => {
    try {
        const user = await deliveryClient.getEntry(id);
        const images = user.fields.uploads;
        return images;
    } catch (err) {
        console.log("error getting contentful images: %s", err);
    }
}

module.exports.getImageById = async id => {
    try {
        const space = await manageClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const image = await space.getAsset(id);
        return image;
    } catch (err) {
        console.log("error getting contentful image by id %s", err);
    }
}