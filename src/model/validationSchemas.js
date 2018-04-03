const Joi = require ('joi');
Joi.objectId = require('joi-objectid')(Joi);
module.exports = {
    authBodySchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    updateBodySchema: Joi.object().keys({
        name: Joi.string().min(3).max(30),
        age: Joi.number().integer().min(1).max(150),
        description: Joi.string()
    }).or('name', 'age', 'description'),

    objectIdParamSchema: Joi.object().keys({
        _id: Joi.objectId()
    }).or('_id'),

    oauthBodySchema: Joi.object().keys({
        access_token: Joi.string().required(),
        refresh_token: Joi.string()
    }),
};