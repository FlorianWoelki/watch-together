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

var players = {}

io.on('connection', function (socket) {
    let id = socket.id;

    Object.keys(players).forEach(function (key) {
        socket.emit('userJoin', players[key])
    })

    socket.on('playerEvent', function (str) {
        switch (str) {
            case 'play':
                io.sockets.emit('playVideo')
                break
            case 'pause':
                io.sockets.emit('pauseVideo')
                break
        }
    })

    socket.on('userJoin', function (username) {
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

    socket.on('disconnect', function () {
        let username = players[id]
        io.sockets.emit('userLeave', username)
        io.sockets.emit('connectedCount', Object.keys(io.sockets.sockets).length)
        delete players[id]
    })

    console.log('a user connected')
})