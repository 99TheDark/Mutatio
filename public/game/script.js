const socket = io();

const ranking = ["conjunction", "article", "noun", "adjective", "pronoun", "verb", "adverb", "interjection"];

const capitalize = str => `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
const createWord = word => `<li class="word">${capitalize(word)}</li>`;

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

socket.on("define", word => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(data => data.json())
        .then(json => {
            const meanings = json[0].meanings;
            const meaning = meanings.reduce(
                (acc, cur) => ranking.indexOf(cur.partOfSpeech) < ranking.indexOf(acc.partOfSpeech) ? cur : acc,
                meanings[0]
            );

            const def = meaning.definitions[0].definition;

            $("#past").prepend(createWord(word));
            $("#last").text(capitalize(word));
            $("#define").text(def);

            socket.emit("status", true, word, def);
        })
        .catch(() => socket.emit("status", false, null, null))
});

socket.on("turn", (ignore, word, definition) => {
    if(!ignore) {
        $("#past").prepend(createWord(word));
        $("#last").text(capitalize(word));
        $("#define").text(definition);
    }
});