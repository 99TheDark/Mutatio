const socket = io();

const capitalize = str => `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
const createWord = word => `<li class="word">${capitalize(word)}</li>`;

const update = (word, definition) => {
    $("#past").prepend(createWord(word));
    $("#last").text(capitalize(word));
    $("#define").text(definition);
};

$(document).ready(() => {
    $("input").keyup(e => {
        if(e.key == "Enter") socket.emit("guess", $("input").val());
    });
});

socket.on("setup", (words, definition) => {
    words.forEach(word => $("#past").prepend(createWord(word)));

    $("#last").text(capitalize(words.at(-1)));
    $("#define").text(definition);
});

socket.on("turn", (word, definition) => {
    update(word, definition);
});