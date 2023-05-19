const {lemmatizer} = require("lemmatizer");

module.exports = class Game {
    constructor(name) {
        this.players = [];
        this.turn = 0;
        this.past = [];
        this.definition = null;
        this.name = name;
    }
    add(player) {
        this.players.push(player);
    }
    remove(player) {
        const idx = this.players.indexOf(player);
        this.players.splice(idx, 1);
        if(idx < this.turn) this.turn--;
        if(idx >= this.players.length) this.turn = 0;
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
    lastWord() {
        return this.past[this.past.length - 1];
    }
    current() {
        return this.players[this.turn];
    }
    totalWords() {
        return this.past.length;
    }
    isTurn(player) {
        return this.players.indexOf(player) == this.turn;
    }
    wasTurn(player) {
        return this.players.indexOf(player) == (this.turn == 0 ? this.players.length : this.turn) - 1;
    }
    count() {
        return this.players.length;
    }
    ids() {
        return this.players.map(player => player.id);
    }
};
