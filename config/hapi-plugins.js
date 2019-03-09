const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');
const Inert = require('inert');
const Vision = require('vision');

let swaggerOptions = {
    host: process.env.SWAGGER_URL?process.env.SWAGGER_URL:"localhost:8000",
    info: {
        title: process.env.SWAGGER_API_TITLE ? process.env.SWAGGER_API_TITLE : 'Hapi-Swagger Example API',
		version: Pack.version,
        description: process.env.SWAGGER_API_TITLE ? process.env.SWAGGER_API_TITLE : 'Hapi-Swagger Example API'
    }
};

module.exports = [
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: swaggerOptions
    }
]