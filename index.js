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

io.on('connection', function (socket) {
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

    console.log('a user connected')
    io.sockets.emit('connectedCount', Object.keys(io.sockets.sockets).length)
})