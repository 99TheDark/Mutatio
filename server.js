const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const {Game} = require("./game.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

const game = new Game();

app.use(express.static(`${__dirname}/public/`));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/redirect.html`);
    console.log("Page loaded");
});

io.on("connection", socket => {
    game.add(socket);

    socket.on("disconnect", () => {
        game.remove(socket);
    });

    socket.on("guess", val => {
        if(game.canGuess(socket)) {
            console.log(`${socket.id} guessed ${val}`);
            game.next(); 
        } else {
            console.log(`${socket.id} illegally tried to guess ${val}`);
        }
    })
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});