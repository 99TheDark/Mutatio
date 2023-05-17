const path = require("path");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const {Game} = require("./game.js");
const {compare} = require("./words.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8080;
const base = path.join(__dirname, "..");

const game = new Game();

app.use(express.static(`${base}/public/`));

game.guess("tail");
game.define("The hindmost part of an animal, especially when prolonged beyond the rest of the body, such as the flexible extension of the backbone in a vertebrate, the feathers at the hind end of a bird, or a terminal appendage in an insect.");

app.get("/", (req, res) => {
    res.sendFile(`${base}/redirect.html`);
});

io.on("connection", socket => {
    game.add(socket);

    socket.emit("setup", game.count() == 1, game.past, game.definition);

    socket.on("disconnect", () => {
        const wasTurn = game.isTurn(socket);
        game.remove(socket);

        if(wasTurn) {
            game.players.forEach(player => player.emit("update", game.isTurn(player)));
        }
    });

    socket.on("guess", val => {
        if(game.isTurn(socket)) {
            const word = val.toLowerCase();
            if(
                !game.past.includes(word) &&
                /^[a-z]*$/g.test(word) &&
                compare(word, game.last()) == 1 &&
                game.valid(word)
            ) {
                socket.emit("define", word);
            } else {
                socket.emit("invalid", word);
            }
        }
    });

    socket.on("status", (status, word, definition) => {
        if(status && game.isTurn(socket)) {
            const prev = game.current();
            game.next();
            game.guess(word);
            game.define(definition);

            game.players.forEach(player => {
                player.emit("turn", player == prev, game.isTurn(player), word, definition);
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});