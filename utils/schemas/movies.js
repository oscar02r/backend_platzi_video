const joi = require('@hapi/joi');


const movieIdSchema = joi.object({ id: joi.string().regex(/^[0-9a-fA-F]{24}$/)});

const movieTitleSchema = joi.string().max(80);
const movieYearSchema = joi.number().min(1888).max(2077);
const movieCoverSchema = joi.string().uri();
const movieDescriptionSchema = joi.string().max(300);
const movieDurationSchema = joi.number().min(1).max(300);
const movieContentRatSchema = joi.string().max(5);
const movieSourceSchema = joi.string().uri();
const movieTagsSchema = joi.array().items(joi.string().max(50));

const createMoviesSchema = joi.object({
       title: movieTitleSchema.required(),
       year:movieYearSchema.required(),
       cover:movieCoverSchema.required(),
       description:movieDescriptionSchema.required(),
       duration: movieDurationSchema.required(),
       contentRating: movieContentRatSchema.required(),
       source: movieSourceSchema.required(),
       tags: movieTagsSchema
});


const updateMovieSchema = joi.object({
    title: movieTitleSchema,
    year:movieYearSchema,
    cover:movieCoverSchema,
    description:movieDescriptionSchema,
    duration: movieDurationSchema,
    contentRating: movieContentRatSchema,
    source: movieSourceSchema,
    tags: movieTagsSchema
});

module.exports = {
      movieIdSchema,
     createMoviesSchema,
     updateMovieSchema
};
