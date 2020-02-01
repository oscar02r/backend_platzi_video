const express = require('express');
const passport = require('passport');
const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/user');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

// JWT strategy
require('../utils/auth/strategies/jwt');

function userMoviesApi(app){
        const router = express.Router();
        app.use('/api/user-movies', router);
        
        const userMoviesService = new UserMoviesService();

        router.get('/', passport.authenticate('jwt', {session:false }), 
          scopesValidationHandler(['read:user-movies']),
          //validationHandler({userId: userIdSchema}, 'query'),
          async function(req, res, next){
               const {userId} = req.query;
               try {
                    const userMovies = await userMoviesService.getUserMovies({userId});
                    res.status(200).json({
                        data:userMovies,
                        message: 'User movies listed'
                    });
               } catch (error) {
                   next(error);
               }
        }
        );

        router.post(
            '/',
            passport.authenticate('jwt', { session: false }),
            scopesValidationHandler(['create:user-movies']),
            validationHandler(createUserMovieSchema),
            async function(req, res, next) {
              const { body: userMovie } = req;
        
              try {
                const createdUserMovieId = await userMoviesService.createUserMovie({
                  userMovie
                });
        
                res.status(201).json({
                  data: createdUserMovieId,
                  message: 'user movie createds'
                });
              } catch (err) {
                next(err);
              }
            }
          );

        router.delete('/:id', passport.authenticate('jwt', {session:false }),
          scopesValidationHandler(['delete:user-movies']),
          validationHandler(movieIdSchema, 'params'),
          async function(req, res, next){
              const {id} = req.params;
              
              try {
                  const deleteUserMovieId = await  userMoviesService.deleteUserMovie({id});
                  res.status(200).json({
                      data:deleteUserMovieId,
                      message:'User movie deleted'
                  });
              } catch (error) {
                  next(error);
              }
        });

}

module.exports = userMoviesApi;
