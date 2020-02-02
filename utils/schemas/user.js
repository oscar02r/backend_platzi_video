const joi = require('@hapi/joi');

const userIdSchema = joi.object({id:joi.string().regex(/^[0-9a-fA-F]{24}$/)});

const userSchema = joi.object({
    name:joi.string().max(100).required(),
    email: joi.string().email().required(),
    password:joi.string().required(),
});

const createUserSchema = {
      ...userSchema,
      isAdmin: joi.boolean()
};

const createProviderUserSchema = {
    ...userSchema,
    apiKeyToken:joi.string().required()
};

module.exports = {
    userIdSchema,
    createUserSchema,
    createProviderUserSchema
};