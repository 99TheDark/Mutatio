module.exports = class Player {
    constructor(socket, username, gameid) {
        this.socket = socket;
        this.id = socket.id;
        this.name = username;
        this.game = gameid;
        this.points = 0;
        this.spectating = false;
    }
    emit(...args) {
        this.socket.emit(...args);
    }
    on(...args) {
        this.socket.on(...args);
    }
    spectate() {
        this.spectating = true;
    }
};