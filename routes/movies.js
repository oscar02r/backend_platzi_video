const express = require('express');
const MoviesService = require('../services/movies');
const passport = require('passport');

const {
    movieIdSchema,
    createMoviesSchema,
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

            const movies = await movieService.getMovies({
                tags
            });

            res.status(200).json({
                data: movies,
                message: 'Moives listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get('/:id', passport.authenticate('jwt', { session:false }), 
      scopesValidationHandler(['read:movies']),
      validationHandler(movieIdSchema, 'params'),
       async function (req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        const { id } = req.params;
        try {
            const movie = await movieService.getMovie({id});

            res.status(200).json({
                data: movie,
                message: 'Moive retrieved'
            });
        } catch (err) {
            next(err);
        }
    });

    router.post('/create', passport.authenticate('jwt', { session:false }),
      scopesValidationHandler(['create:movies']),
      validationHandler(createMoviesSchema),
      async function (req, res, next) {
         
        const {
            body: movie
        } = req;
        try {
            const createMoviId = await movieService.createMovie({ movie});

            res.status(201).json({
                data: createMoviId,
                message: 'Moives created'
            });
        } catch (err) {
            next(err);
        }
    });

    router.delete('/:id',passport.authenticate('jwt', { session:false }), 
      scopesValidationHandler(['delete:movies']),
      validationHandler(movieIdSchema, 'params'), 
      async function (req, res, next) {
       
        try {
            const {
                id
            } = req.params;
            const deletemovieId = await movieService.deleteMovieId({id});;
                  
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
    validationHandler({movieId: movieIdSchema}, 'params'),
    validationHandler(updateMovieSchema), async function (req, res, next) {
        const {
            movieId
        } = req.params;
        const {
            body: movie
        } = req;
        try {
            const updatemovieId = await movieService.updateMovie({
                movieId,
                movie
            });

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