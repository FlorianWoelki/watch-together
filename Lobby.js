class Lobby extends Room {

    constructor(name, io) {
        super(name, io);
        this.io = io;
        this.listenOnLobby();
    }

    listenOnLobby() {
        this.namespace('connection', (socket) => {

        });
    }

}

module.exports = Lobby;