const Hapi = require('hapi');
require('dotenv').config()
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const verify = async function (decoded, request) {
    let token = request.headers.authorization;
    let isValid = false;
    if (token) {
        await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!decoded) {
                isValid = false
            } else {
                request.headers.hyperledgertoken = decoded.hyperledgertoken;
                isValid = true;
            }
        });
    }
    return { isValid, credentials: true };
};


const start = async () => {
    const server = await new Hapi.Server({
        host: process.env.HOST ? process.env.HOST : '0.0.0.0',
        port: process.env.PORT ? process.env.PORT : 8000,
        routes: {
            cors: true
        }
    });

    //registers swagger plugins
    await server.register(require("./config/hapi-plugins"))

    //register, define and and set the default auth scheme
    await server.auth.strategy('jwt', 'jwt',
        {
            key: process.env.JWT_SECRET,          // Never Share your secret key
            validate: verify         // validate function defined above
            //verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
        });
    server.auth.default('jwt');


    //mongoose 
    mongoose.connect(process.env.MONGODB_URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        // we're connected!
        console.log("Database connected!")
    });

    //Routes
    server.route((require('./routes/task')));
    server.route((require('./routes/auth')));

    //start the server
    await server.start();

    console.log(`Server listening on ${server.info.uri}`);
}

start()
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
