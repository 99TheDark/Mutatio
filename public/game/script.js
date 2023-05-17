const socket = io();

$(document).ready(() => {
    $("input").keyup(e => {
        if(e.key == "Enter") socket.emit("guess", $("input").val());
    });
});

socket.on("turn", word => {
    console.log(`New word '${word}' guessed`);
    $("#past").prepend(`<li class="word">${word[0].toUpperCase()}${word.substring(1)}</li>`)
});