const socket = io();

const createWord = word => `<li class="word">${word[0].toUpperCase()}${word.substring(1)}</li>`;

$(document).ready(() => {
    $("input").keyup(e => {
        if(e.key == "Enter") socket.emit("guess", $("input").val());
    });
});

socket.on("setup", words => words.forEach(word => {
    $("#past").append(createWord(word));
}));

socket.on("turn", word => {
    $("#past").prepend(createWord(word));
});