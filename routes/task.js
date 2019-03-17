const taskController = require('../controllers/task');
const Joi = require('joi');

module.exports = [
    {
        method: 'POST',
        path: '/task',
        handler: taskController.saveTask,
        config: {
            description: 'Save Task',
            notes: 'Save Task',
            tags: ['api'],
            auth: 'jwt',
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).options({ allowUnknown: true }),
                payload: Joi.object({
                    start: Joi.string(),
                    end: Joi.string(),
                    desc: Joi.string(),
                    title: Joi.string(),
                    allDay: Joi.bool(),
                    userId: Joi.string()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/task',
        handler: taskController.getTasks,
        config: {
            description: 'Get All Tasks',
            notes: 'Get All Tasks',
            tags: ['api'],
            auth: 'jwt',
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).options({ allowUnknown: true })
            }
        }
    },
    {
        method: 'GET',
        path: '/task/{userId}',
        handler: taskController.getTasksByUser,
        config: {
            description: 'Get All Tasks by User',
            notes: 'Get All Tasks by User',
            tags: ['api'],
            auth: 'jwt',
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).options({ allowUnknown: true }),
                params: Joi.object({
                    userId: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/task/{id}',
        handler: taskController.updateTask,
        config: {
            description: 'Update Task',
            notes: 'Update Task',
            tags: ['api'],
            auth: 'jwt',
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).options({ allowUnknown: true }),
                payload: Joi.object({
                    start: Joi.string(),
                    end: Joi.string(),
                    desc: Joi.string(),
                    title: Joi.string(),
                    allDay: Joi.bool(),
                    userId: Joi.string()
                }),
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/task/{id}',
        handler: taskController.deleteTask,
        config: {
            description: 'Delete Task',
            notes: 'Delete Task',
            tags: ['api'],
            auth: 'jwt',
            validate: {
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).options({ allowUnknown: true }),
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    }
]