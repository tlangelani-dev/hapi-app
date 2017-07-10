const Hapi = require('hapi');
const PORT = 8009;

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

const tasks = [
    { task: 'Cook supper tonight.' },
    { task: 'Read a book.' },
    { task: 'Clean your room.' }
];


server.route({
    method: 'GET',
    path: '/tasks',
    handler: (request, reply) => {
        reply.view('tasks', {
            title: 'Tasks',
            tasks: tasks
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
