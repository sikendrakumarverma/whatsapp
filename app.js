const app = require('express')();
const http = require('http').Server(app);

const path = require('path');
const io = require('socket.io')(http);

app.get('/', function (req, res) {

    var options = {
        root: path.join(__dirname)
    }

    res.sendFile('index.html', options);
});
// connection
let users = 0;
// A.) when a user join
io.on('connection', function (socket) {
    //console.log(socket)
    console.log('a user is connected');

    setTimeout(function(){
      // 1. send message to client by preserved Send event
      socket.send('this message from the server side')
    },3000);

    // 2. Receiving a custom event from client.
    socket.on('myCustomEventOfClient', function(data){
        console.log(data.msg);
    }) 

    // users++;
    // // 1. Globally send an event by name of broadcast
    // io.sockets.emit('broadcast', { message: 'Join the chat'});

    // // 2. send an event by name of newUserConnected for only new User Connected
    // socket.emit('newUserConnected', { message: 'Hi Welcome In Live Chatting App'});
 
    // // 3. send an event by name of newUserConnected for already Connected users
    // socket.broadcast.emit('newUserConnected', { message: users + 'users connected'});

    // // B.) when a user leave Receiving disconnect event
    // socket.on('disconnect', function () {
    //     console.log('a user is disconnected');
    //     users--;
    //     // 1. Globally send an event by name of broadcast
    //     io.sockets.emit('broadcast', { message: 'Leave the chat'});

    //     // 2. send an event by name of newUserConnected for already Connected users
    //     socket.broadcast.emit('newUserConnected', { message: users + 'users connected'});
    // });
});

http.listen(8080, () => {
    console.log("App is running on 8080");
});