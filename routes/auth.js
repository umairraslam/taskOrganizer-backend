const Joi = require('joi');
const authController = require('../controllers/auth');

module.exports = [
    {
        method: 'POST',
        path: '/user/login',
        handler: authController.authenticate,
        config: {
            description: 'Authenticate',
            notes: 'Authenticate',
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/user/forgotPassword',
        handler: authController.forgotPassword,
        config: {
            description: 'Handle forgot password',
            notes: 'Handle forgot password',
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/user/signUp',
        handler: authController.signUp,
        config: {
            description: 'Sign up',
            notes: 'Sign up',
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    role: Joi.string().required(),
                    email: Joi.string().required(),
                    dob: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/user/resetPassword',
        handler: authController.resetPassword,
        config: {
            description: 'Reset password',
            notes: 'Reset password',
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    password: Joi.string().required(),
                    token: Joi.string().required()
                })
            }
        }
    }
]