const Joi = require('joi');
const validationSchema = require ('../model/validationSchemas');
const mongoose = require('mongoose');
const image = require('../model/image');

module.exports.validateAuthBody = () => {
    return (req, res, next) => {
        const result = Joi.validate(req.body, validationSchema.authBodySchema);

        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    };
};

module.exports.validateUpdateBody = () => {
    return (req, res, next) => {
        const result = Joi.validate(req.body, validationSchema.updateBodySchema);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    }
}

module.exports.validateParamObjectId = () => {
    return (req, res, next) => {
        const result = Joi.validate(req.params, validationSchema.objectIdParamSchema);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    }
}

module.exports.validateImageBelongToUser = async (req, res, next) => {
    try {
        const userImage = req.user.uploads;
        const _id = mongoose.Types.ObjectId(req.params._id);
        const result = await image.getImageById(_id);
        const userImageId = userImage.map(i => {
            return i.id.toString();
        });
        if (!userImageId.includes(req.params._id)) {
            if (!result || result.length === 0) {
            return res.status(400).json({err: "No image was found"});
            }
            return res.status(400).json({err: "Image does not belong to this user"});
        }
        req.foundedImage = await result;
        req._id = _id;
        next();
    } catch (err) {
        next(err);
    }
    
}