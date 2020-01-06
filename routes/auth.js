const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const UsersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');

const { createUserSchema } = require('../utils/schemas/user');

const { config } = require('../config');

//Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
    const router = express.Router();
    app.use('/api/auth', router)

    const apiKeysService = new ApiKeysService();
    const userService = new UsersService();
    const THIRTY_DAYS_IN_SEC = 2592000;
    const TWO_HOURS_IN_SEC = 7200;

    router.post('/sign-in', function(req, res, next){
        const {apiKeyToken} = req.body;
    
        if(!apiKeyToken){
            next(boom.unauthorized());  
        }

        passport.authenticate('basic',function(error, user){
               try {
                   if(error || !user){
                       next(boom.unauthorized());
                   }

                   req.login(user,{session:false},
                    async function( error ){
                       if(error){
                          next(error);
                       }
                    const apiKey = await apiKeysService.getApiKey({token:apiKeyToken});

                    if(!apiKey){
                        next(boom.unauthorized());
                    }
                   
                    const { _id:id, name, email } = user;
                    
                    const payload ={
                        sub:id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    };

                    const token = jwt.sign(payload, config.authJwtSecret, {expiresIn: '15m'});

                    return res.status(200).json({
                        token,
                        user:{
                            id,
                            name,
                            email
                        }
                    });
                   });
               } catch (error) {
                   next(error);
               }
        } )(req, res, next);
        
  });

   router.post('/sign-up', async function(req, res, next){
         const { body:user } = req;

         try {
             const createUserId = await userService.createUser({user});

             res.status(201).json({
                 data:createUserId,
                 message:'User created'
             });
         } catch (error) {
             next(error)
         }
   });

}

module.exports = authApi;