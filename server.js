const express = require('express');
const app = express();
const http = require('http').createServer(app);

const port = process.env.PORT || 8080

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//socket.io setup

// const io = require('socket.io')(http);
const io = require('socket.io')(http, {
    cors: {
        origin: "https://whatsapp2-one.vercel.app",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
let users = {};

// when a user join cache all events by .on function
io.on('connection', function (socket) {
    // when a new user join
    socket.on('new-user-joined', function (userName) {
        users[socket.id] = userName; // storing users information in users.
        // send an event by name of user-connected for already Connected users
        socket.broadcast.emit('user-connected', userName);
        // Globally send an event for users list and count
        io.emit('user-list', users);
    });

    // when a user leave or disconnect the chat
    socket.on('disconnect', function () {
        // send an event user-connected for Connected users
        socket.broadcast.emit('user-disconnected', user = users[socket.id]);
        delete users[socket.id]; // deleting users information from users.
        // Globally send an event for users list and count
        io.emit('user-list', users);
    });

    // Receiving message from client
    socket.on('message', (data) => {
        // Sending message to all users
        socket.broadcast.emit('message', { user: data.user, msg: data.msg });
    });
});

http.listen(port, () => {
    console.log("App is running on port", port);
});
