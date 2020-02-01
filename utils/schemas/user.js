const joi = require('@hapi/joi');

const userIdSchema = joi.object({id:joi.string().regex(/^[0-9a-fA-F]{24}$/)});

const createUserSchema = joi.object({
    name:joi.string().max(100).required(),
    email: joi.string().email().required(),
    password:joi.string().required(),
    isAdmin: joi.boolean()
});

module.exports = {
    userIdSchema,
    createUserSchema
};