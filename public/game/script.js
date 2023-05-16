const socket = io();

$(document).ready(() => {
    $("input").keyup(e => {
        if(e.key == "Enter") socket.emit("guess", $("input").val());
    });
});