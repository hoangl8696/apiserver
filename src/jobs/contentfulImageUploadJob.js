const contentfulImage = require('../contentful/image');
const contentfulUser  = require('../contentful/user');

module.exports.processJob = async (job, done) => {
    try {
        const { body, file, userId } = job.data;
        const encodedData = new Buffer(file.buffer, 'base64'); 
        file.buffer = encodedData;
        const image = await contentfulImage.uploadImage(body, file);
        await contentfulUser.linkAsset(userId, image.sys.id);
        done();
    } catch (err) {
        done(err);
    }
}