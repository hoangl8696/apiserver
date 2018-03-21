const Joi = require('joi');

const authBodyValidationSchema = require ('./validationSchemas').authBodySchema;

validateBody = () => {
    return (req, res, next) => {
        const result = Joi.validate(req.body, authBodyValidationSchema);

        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    };
};

module.exports = validateBody;