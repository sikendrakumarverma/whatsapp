const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

// Backend server environment
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// Tell using static file which is present inside the public folder
app.use(express.static(__dirname + '/public'))

//Deliver message of client 
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

//Binding Backend with Socket 
const io = require('socket.io')(http)

// When connected new user than broadcast all connected user
io.on('connection', (socket) => {
   // console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})