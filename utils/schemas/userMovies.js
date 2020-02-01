const joi = require('@hapi/joi');

const userMovieIdSchema = joi.object({ id: joi.string().regex(/^[0-9a-fA-F]{24}$/)});

const createUserMovieSchema = joi.object( {
       userMovieId:joi.string().regex(/^[0-9a-fA-F]{24}$/),
       movieId:joi.string().regex(/^[0-9a-fA-F]{24}$/)

});

module.exports = {
    userMovieIdSchema,
    createUserMovieSchema
};
