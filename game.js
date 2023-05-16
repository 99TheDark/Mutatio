module.exports = {
    Game: class {
        constructor() {
            this.players = [];
            this.turn = 0;
            this.past = [];
        }
        add(player) {
            this.players.push(player);
        }
        remove(player) {
            const idx = this.players.indexOf(player);
            this.players.splice(idx, 1);
            if(idx < this.turn) this.turn--;
        }
        next() {
            this.turn = (this.turn + 1) % this.players.length;
        }
        canGuess(player) {
            return this.players.indexOf(player) == this.turn;
        }
        count() {
            return this.players.length;
        }
        ids() {
            return this.players.map(player => player.id);
        }
    }
};