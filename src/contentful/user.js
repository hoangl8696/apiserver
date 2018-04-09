const contentfulManagement = require('contentful-management');
const contentful = require('contentful');

const manageClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
});

const deliveryClient = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN
});

module.exports.createUser = async email => {
    try {
        const space = await manageClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const newUser = await space.createEntry('user', {
            fields: {
                email: {
                    'en-GB': email
                }
            }
        });
        return await newUser.publish();
    } catch (err) {
        console.log("error create contentful user: %s", err);
    }
}

module.exports.deleteUserById = async id => {
    try {
        const space = await manageClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const foundedUser = await space.getEntry(id);
        if (foundedUser.isPublished()) {
            await foundedUser.unpublish();
        }
        await foundedUser.delete();
        return foundedUser;
    } catch (err) {
        console.log("error delete contentful user: %s", err);
    }
}

module.exports.getUserById = async id => {
    try {
        const user = await deliveryClient.getEntries({
            content_type: 'user',
            'sys.id': id,
            locale: 'en-GB'
        });
        return user.items;
    } catch (err) {
        console.log("error getting a user by id: %s", err);
    }
}

module.exports.linkAsset = async (userId, assetId) => {
    try {
        const space = await manageClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const user = await space.getEntry(userId);
        if (user.fields.uploads === undefined) {
            user.fields.uploads = {'en-GB': []};
        }
        user.fields.uploads['en-GB'].push({
            sys: {
                type: 'Link',
                linkType: 'Asset',
                id: assetId
            }
        });
        const updatedUser = await user.update();
        const publishedUser = await updatedUser.publish();
        return publishedUser;
    } catch (err) {
        console.log("error linking asset: %s", err);
    }
}