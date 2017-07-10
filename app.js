const Hapi = require('hapi');
const PORT = 8009;

require('dotenv').config();

const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds133981.mlab.com:33981/${process.env.MONGO_DB}`;

const mongoose = require('mongoose');
mongoose.connect(mongoUrl, {useMongoClient: true})
    .then(() => {
        console.log('Mongodb connected!');
    })
    .catch(error => console.log(error));

// create Task Model
const Task = mongoose.model('Task', {
    task: String
});

const server = new Hapi.Server();

server.connection({
    port: PORT,
    host: 'localhost'
});

// routes
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('index', {
            title: 'Home Page'
        });
    }
});

server.route({
    method: 'GET',
    path: '/user/{name}',
    handler: (request, reply) => {
        reply(`Hello ${request.params.name}!`)
    }
});

server.route({
    method: 'GET',
    path: '/tasks',
    handler: (request, reply) => {
        let tasks = Task.find((error, tasks) => {
            reply.view('tasks', { title: 'Tasks', tasks: tasks })
        });
    }
});

server.route({
    method: 'POST',
    path: '/tasks',
    handler: (request, reply) => {
        let task = request.payload.task;
        let newTask = new Task({
            task: task
        });
        newTask.save((error, task) => {
            if (error) return console.log(error);
            return reply.redirect().location('tasks');
        });
    }
});

// static routes
server.register(require('inert'), error => {
    if (error) throw error;
    server.route({
        method: 'GET',
        path: '/about',
        handler: (request, reply) => {
            reply.file('./public/about.html');
        }
    });
});

server.register(require('vision'), error => {
    if (error) throw error;
    server.views({
        engines: {
            html: require('handlebars')
        },
        path: __dirname + '/views'
    });
});

server.start(error => {
    if (error) throw error;
    console.log(`Hapi server running on port ${PORT}`);
});
