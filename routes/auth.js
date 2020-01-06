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

    router.post('/sign-in', async function (req, res, next) {
        //const { apiKeyToken } = req.body;
        const { rememberMe } = req.body;
       /* if (!apiKeyToken) {
            next(boom.unauthorized('ApiKeyToken is required'));
        }*/

        passport.authenticate('basic', function (error, data) {
            try {

                if (error || !data) {
                    next(boom.unauthorized());
                }

                req.login(data, {
                    session: false
                }, 
                async function (error) {
                    if (error) {
                        next(error);
                    }
                    
                    const {token, ...user} = data;

                    res.cookie("token", token,{
                        httpOnly: !config.dev,
                        secure:!config.dev,
                        maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
                    });
                    /*const apiKey = await apiKeysService.getApiKey({
                        token: apiKeyToken
                    });*/



                   /* if (!apiKey) {
                        next(boom.unauthorized());
                    }*/

                   /* const {
                        _id: id,
                        name,
                        email
                    } = user;

                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }

                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    });*/

                    /*return res.status(200).json({
                        token,
                        user: {
                            id,
                            name,
                            email
                        }
                    });*/

                    res.status(200).json(user);
                });

            } catch (error) {
                next(error)
            }
        })(req, res, next);
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