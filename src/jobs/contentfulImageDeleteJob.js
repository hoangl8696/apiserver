const contentfulImage = require('../contentful/image');
const contentfulUser  = require('../contentful/user');

module.exports.processJob = async (job, done) => {
    try {
        const { imageId, userId } = job.data;
        const results = await Promise.all([
            contentfulUser.unlinkAsset(userId, imageId),
            contentfulImage.deleteImageById(imageId)
        ])
        done();
    } catch (err) {
        done(err);
    }
}