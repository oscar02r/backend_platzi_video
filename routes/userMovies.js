const express = require('express');
const passport = require('passport');
const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middleware/validationHandler');

const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/user');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

// JWT strategy
require('../utils/auth/strategies/jwt');

function userMoviesApi(app){
        const router = express.Router();
        app.use('/api/user-movies', router);
        
        const userMoviesService = new UserMoviesService();

        router.get('/', passport.authenticate('jwt', {session:false }), validationHandler({userId: userIdSchema}, 'query'),
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

        router.post('/', passport.authenticate('jwt', {session:false }), validationHandler(createUserMovieSchema), 
        async function(req, res,next){
              const {body:userMovie} = req;

              try {
                  const createdUserMovieId = await userMoviesService.createUsrMovie({
                      userMovie
                  });

                  res.status(201).json({
                       data:createdUserMovieId,
                       message:'User movie created'
                  });
              } catch (error) {
                  next(error)
                  
              }
        });

        router.delete('/:userMovieId', passport.authenticate('jwt', {session:false }), validationHandler({userMovieId: movieIdSchema}, 'params'),
        async function(req, res, next){
              const {userMovieId} = req.params;
              try {
                  const deleteUserMovieId = await userMoviesService.deleteUserMovie({userMovieId});
                  res.status(200).json({
                      data:deleteUserMovieId,
                      message:'User movie deleted'
                  });
              } catch (error) {
                  next(error)
              }
        });

}

module.exports = userMoviesApi;