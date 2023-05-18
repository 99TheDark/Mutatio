const {lemmatizer} = require("lemmatizer");

module.exports = class Game {
    constructor() {
        this.players = [];
        this.turn = 0;
        this.past = [];
        this.definition = null;
    }
    add(player) {
        this.players.push(player);
    }
    remove(player) {
        const idx = this.players.indexOf(player);
        this.players.splice(idx, 1);
        if(idx < this.turn) this.turn--;
    }
    valid(word) {
        return !this.past.includes(lemmatizer(word));
    }
    guess(word) {
        this.past.push(word);
    }
    define(definition) {
        this.definition = definition;
    }
    next() {
        this.turn = (this.turn + 1) % this.players.length;
    }
    last() {
        return this.past[this.past.length - 1];
    }
    current() {
        return this.players[this.turn];
    }
    total() {
        return this.past.length;
    }
    isTurn(player) {
        return this.players.indexOf(player) == this.turn;
    }
    count() {
        return this.players.length;
    }
    ids() {
        return this.players.map(player => player.id);
    }
};