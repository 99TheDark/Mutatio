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

game.guess("sand");
game.define("A loose granular substance, typically pale yellowish brown, resulting from the erosion of siliceous and other rocks and forming a major constituent of beaches, riverbeds, the seabed, and deserts.");

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
        const word = val.toLowerCase();

        if(
            game.isTurn(socket) &&
            !game.past.includes(word) &&
            /^[a-z]*$/g.test(word) &&
            compare(word, game.last()) == 1
        ) {
            game.current().emit("define", word);
        }
    });

    socket.on("status", (status, word, definition) => {
        if(status && game.isTurn(socket)) {
            const prev = game.current();
            game.next();
            game.guess(word);
            game.define(definition);

            game.players.forEach(player => {
                player.emit("turn", player == prev, player == game.current(), word, definition);
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});