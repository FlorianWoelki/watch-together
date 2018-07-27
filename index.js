const express = require('express')
const app = express();
const path = require('path')
const db = require('./db')
const PORT = process.env.PORT || 5000

require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('index'))

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))
const io = require('socket.io').listen(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.ejs')
})

var players = {}

//const Room = require('./Room')
//var testRoom = new Room('test room', io)

app.get('/:id', (req, res) => {
    console.log(req.params['id'])
    // @todo - add socket io join room and leave functionality, not using oop, maybe for later...
    function joinRoom(socket, room) {
        if (socket.room) {
            socket.leave(socket.room)
        }
        socket.join(room)
        socket.room = room
        console.info(socket.id + ' joined room ' + room, socket.room)
    }
})

io.on('connection', (socket) => {
    let id = socket.id;

    Object.keys(players).forEach((key) => {
        socket.emit('userJoin', players[key])
    })

    socket.on('playerEvent', (str) => {
        switch (str) {
            case 'play':
                io.sockets.emit('playVideo')
                break
            case 'pause':
                io.sockets.emit('pauseVideo')
                break
        }
    })

    socket.on('userJoin', (username) => {
        if (!username) {
            let generatedUsername = 'User ' + Object.keys(io.sockets.sockets).length
            username = generatedUsername

            io.sockets.emit('userJoin', generatedUsername)
        } else {
            io.sockets.emit('userJoin', username)
        }

        players[id] = username
        io.sockets.emit('connectedCount', Object.keys(io.sockets.sockets).length)
    })

    socket.on('disconnect', () => {
        let username = players[id]
        io.sockets.emit('userLeave', username)
        io.sockets.emit('connectedCount', Object.keys(io.sockets.sockets).length)
        delete players[id]
    })

    console.log('a user connected')
})