module.exports = class Player {
    constructor(socket, gameid) {
        this.socket = socket;
        this.id = socket.id;
        this.game = gameid;
        this.spectating = false;
    }
    spectate() {
        this.spectating = true;
    }
};