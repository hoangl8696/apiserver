const Joi = require('joi');
const validationSchema = require ('../model/validationSchemas');
const mongoose = require('mongoose');
const image = require('../model/image');
const config = require('../config/config');
const contentfulImage = require('../contentful/image');
// const logger = require('../util/logger');

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

module.exports.validateContentfulImageBelongToUser = async (req, res, next) => {
    try {
        const images = await contentfulImage.getImagesOfUser(req.user.contentfulId);
        if (images) {
            const id = images.map(image => image.sys.id.toString());
            if (id.includes(req.params._id)) {
                return next();
            }
            return res.status(401).json({error: 'cannot find this image or this image does not belong to the user'});
        }
        return res.status(404).json({error: 'this user have no images'});
    } catch (err) {
        return next(err);
    }
}

module.exports.validateDeveloper = (req, res, next) => {
    // logger.debug("logging successful!");
    const api_key = req.headers[config.API_KEY_NAME];
    if (!api_key) {
        return res.status(401).send("Unauthorized");
    } else if (api_key !== process.env.API_KEY) {
        return res.status(403).send("Incorrect key");
    }
    next();
}

module.exports.validateOAuthBody = () => {
    return (req,res,next) => {
        const result = Joi.validate(req.body, validationSchema.oauthBodySchema);

        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    }
}

module.exports.validateContentfulUploadBody = () => {
    return (req,res,next) => {
        const result = Joi.validate(req.body, validationSchema.contentfulFileUploadSchema);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    }
}