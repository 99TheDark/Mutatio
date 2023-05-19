module.exports = class Player {
    constructor(socket, username, gameid) {
        this.socket = socket;
        this.id = socket.id;
        this.name = username;
        this.game = gameid;
        this.points = 0;
        this.spectating = false;
    }
    spectate() {
        this.spectating = true;
    }
};