const path = require("path");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const Game = require("./game.js");
const Player = require("./player.js");
const compare = require("./words.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 8080;
const base = path.join(__dirname, "..");

const game = new Game("testing-");

app.use(express.static(`${base}/public/`));

game.guess("cod");
game.define("A large marine fish with a small barbel on the chin.");

app.get("/", (req, res) => {
    res.sendFile(`${base}/redirect.html`);
});

io.on("connection", socket => {
    const player = new Player(socket, socket.id, game.name);
    game.add(player);

    player.emit("setup", game.count() == 1, game.past, game.definition);

    player.on("disconnect", () => {
        const wasTurn = game.isTurn(player);
        game.remove(player);

        if(wasTurn) game.players.forEach(p => p.emit("update", game.isTurn(p)));
    });

    player.on("guess", val => {
        if(game.isTurn(player)) {
            const word = val.toLowerCase();
            if(
                !game.past.includes(word) &&
                /^[a-z]*$/g.test(word) &&
                compare(word, game.lastWord()) == 1 &&
                game.valid(word)
            ) {
                player.emit("define", word);
            } else {
                player.emit("invalid", word);
            }
        }
    });

    player.on("status", (status, word, definition) => {
        if(status && game.isTurn(player)) {
            game.next();
            game.guess(word);
            game.define(definition);

            game.players.forEach(p => {
                p.emit("turn", game.wasTurn(p), game.isTurn(p), word, definition);
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});