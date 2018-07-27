class Room {

    constructor(name, io) {
        this.name = name;
        this.users = [];
        this.namespace = io.of('/' + name);
        this.listenOnRoom();
    }

    listenOnRoom() {
        this.namespace.on('connection', (socket) => {
            console.log('joining room ' + socket.id)
            socket.on('disconnect', (msg) => {
            });
        });
    }
    
}

module.exports = Room;