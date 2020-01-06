const express = require('express');
const MoviesService = require('../services/movies');
const passport = require('passport');

const {
    movieIdSchema,
   // createMoviesSchema,
    updateMovieSchema
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');
const cacheResponse = require('../utils/cacheResponse');

const {FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS} = require('../utils/time');

//JWT strategy
require('../utils/auth/strategies/jwt');

function moviesApi(app) {
    const router = express.Router();

    app.use('/api/movies', router);

    const movieService = new MoviesService();

    router.get('/', passport.authenticate('jwt', { session:false }),  
    scopesValidationHandler(['read:movies']),
    async function (req, res, next) {
        cacheResponse(res,FIVE_MINUTES_IN_SECONDS);
        const {
            tags
        } = req.query;
        try {

            const movies = await Promise.resolve(movieService.getMovies({
                tags
            }));
            res.status(200).json({
                data: movies,
                message: 'Moives listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get('/:movieId',passport.authenticate('jwt', { session:false }), 
      scopesValidationHandler(['read:movies']),
      validationHandler({ movieId: movieIdSchema  }, 'params'), async function (req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        const { movieId} = req.params;
        try {
            const movies = await Promise.resolve(movieService.getMovie({
                movieId
            }));


            res.status(200).json({
                data: movies,
                message: 'Moive retrieved'
            });
        } catch (err) {
            next(err);
        }
    });

    router.post('/', passport.authenticate('jwt', 
      scopesValidationHandler(['create:movies']),
      { session:false }), async function (req, res, next) {
        const {
            body: movie
        } = req;
        try {
            const createMoviId = await Promise.resolve(movieService.createMovie({
                movie
            }));

            res.status(201).json({
                data: createMoviId,
                message: 'Moives created'
            });
        } catch (err) {
            next(err);
        }
    });

    router.delete('/:movieId',passport.authenticate('jwt', { session:false }), 
      scopesValidationHandler(['delete:movies']),
      validationHandler({
        movieId: movieIdSchema
    }, 'params'), async function (req, res, next) {
        const {
            movieId
        } = req.params;
        try {
            const deletemovieId = await Promise.resolve(movieService.deleteMovieId({
                movieId
            }));

            res.status(200).json({
                data: deletemovieId,
                message: 'Moive deleted'
            });
        } catch (err) {
            next(err);
        }
    });

    router.put('/:movieId',passport.authenticate('jwt', { session:false }), 
    scopesValidationHandler(['update:movies']),
    validationHandler({
        movieId: movieIdSchema
    }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
        const {
            movieId
        } = req.params;
        const {
            body: movie
        } = req;
        try {
            const updatemovieId = await Promise.resolve(movieService.updateMovie({
                movieId,
                movie
            }));

            res.status(200).json({
                data: updatemovieId,
                message: 'Moive updated'
            });
        } catch (err) {
            next(err);
        }
    });


}

module.exports = moviesApi;