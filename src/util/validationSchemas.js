const Joi = require ('joi');
const schemas  = {
    authBodySchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};
module.exports = schemas;