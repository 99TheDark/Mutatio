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

app.get("/", (req, res) => {
    res.sendFile(`${base}/redirect.html`);
});

io.on("connection", socket => {
    game.add(socket);

    socket.on("disconnect", () => {
        game.remove(socket);
    });

    socket.on("guess", val => {
        const word = val.toLowerCase();

        if(game.canGuess(socket) && (game.total() == 0 || compare(word, game.last()) == 1)) {
            console.log(`${socket.id} guessed ${word}`);
            game.guess(word);
            game.next();
        }
    })
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});