const express = require('express')
const app = express();
const path = require('path')
const db = require('./db')
const PORT = process.env.PORT || 5000

require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))
const io = require('socket.io').listen(server)

var players = {}

function joinRoom(socket, room) {
    if (socket.room) {
        socket.leave(socket.room)
    }
    socket.join(room)
    socket.room = room
    console.info(socket.id + ' joined room ' + room)
}

app.get('/:id', (req, res) => {
    let room = req.params['id']
    // @todo - add socket io join room and leave functionality, not using oop, maybe for later...
    if (room != 'favicon.ico') {
        io.on('connection', (socket) => {
            let id = socket.id

            joinRoom(socket, room)
        })

        res.render('index', {
            room: room
        })
    }
})

// If user connect to normal page without id
// => generate id and send him to this page
app.get('/', (req, res) => {
    let generatedRoom = guid()
    res.writeHead(302, {
        'Location': '/' + generatedRoom
    })
    res.end()
})

function broadcastToRoom(room, event) {
    io.to(room).emit(event)
}

io.on('connection', (socket) => {
    let id = socket.id

    socket.on('playerEvent', (str) => {
        switch (str) {
            case 'play':
                broadcastToRoom(socket.room, 'playVideo')
                break
            case 'pause':
                broadcastToRoom(socket.room, 'pauseVideo')
                break
        }
    })

    socket.on('userJoin', (username) => {
        if (!username) {
            let generatedUsername = 'User ' + Object.keys(io.sockets.sockets).length
            username = generatedUsername

            io.to(socket.room).emit('userJoin', generatedUsername)
        } else {
            io.to(socket.room).emit('userJoin', username)
        }

        players[id] = username
        io.in(socket.room).clients((err, clients) => {
            io.to(socket.room).emit('connectedCount', clients.length)
        })

        io.in(socket.room).clients((err, clients) => {
            clients.forEach((clientId) => {
                if (clientId != id) {
                    socket.emit('userJoin', players[clientId])
                }
            })
        })
    })

    socket.on('disconnect', () => {
        let username = players[id]
        io.to(socket.room).emit('userLeave', username)

        io.in(socket.room).clients((err, clients) => {
            io.to(socket.room).emit('connectedCount', clients.length)
        })

        delete players[id]
    })

    console.log('a user connected')
})

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}