const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

app.use(express.static(`${__dirname}/public/`));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/redirect.html`);
    console.log("Page loaded");
});

io.on("connection", socket => {
    console.log(`User ${socket.id} connected`);
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});