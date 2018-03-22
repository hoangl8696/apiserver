const Joi = require('joi');

const validationSchema = require ('../model/validationSchemas');

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