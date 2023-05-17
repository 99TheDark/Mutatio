const path = require("path");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const {Game} = require("./game.js");
const {compare, define} = require("./words.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;
const base = path.join(__dirname, "..");

const game = new Game();

app.use(express.static(`${base}/public/`));

game.guess("grain");
define(game.past[0])
    .then(info => game.define(info.first))

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
            define(word)
                .then(info => {
                    if(info != null) {
                        const definition = info.first;

                        console.log(`${socket.id} guessed ${word}`);
                        game.guess(word);
                        game.define(definition);
                        game.next();

                        game.players.forEach(player => {
                            player.emit("turn", word, definition);
                        });
                    }
                })
        }
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});