const path = require("path");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const {Game} = require("./game.js");
const {compare} = require("./words.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;
const base = path.join(__dirname, "..");

const game = new Game();

app.use(express.static(`${base}/public/`));

game.guess("grain");
game.define("The harvested seeds of various grass food crops eg: wheat, corn, barley.");

app.get("/", (req, res) => {
    res.sendFile(`${base}/redirect.html`);
});

io.on("connection", socket => {
    game.add(socket);

    socket.emit("setup", game.past, game.definition);

    socket.on("disconnect", () => {
        game.remove(socket);
    });

    socket.on("guess", val => {
        const word = val.toLowerCase();

        if(
            game.canGuess(socket) &&
            !game.past.includes(word) &&
            /^[a-z]*$/g.test(word) &&
            compare(word, game.last()) == 1
        ) {
            game.current().emit("define", word);
        }
    });

    socket.on("status", (status, word, definition) => {
        if(status && game.canGuess(socket)) {
            game.players.forEach(player => player.emit("turn", player == game.current(), word, definition));

            game.next();
            game.guess(word);
            game.define(definition);
        }
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});