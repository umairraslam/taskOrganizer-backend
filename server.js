const Hapi = require('hapi');
require('dotenv').config()
var mongoose = require('mongoose');

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
