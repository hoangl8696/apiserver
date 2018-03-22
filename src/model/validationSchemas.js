const Joi = require ('joi');
module.exports = {
    authBodySchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    updateBodySchema: Joi.object().keys({
        name: Joi.string().min(3).max(30),
        age: Joi.number().integer().min(1).max(150),
        description: Joi.string()
    }).or('name', 'age', 'description')
};