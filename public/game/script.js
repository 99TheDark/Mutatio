const socket = io();

const ranking = [
    "conjunction",
    "article",
    "adjective",
    "adverb",
    "noun",
    "interjection",
    "verb",
    "pronoun",
];

const capitalize = str => `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
const createWord = word => `<li class="word">${capitalize(word)}</li>`;

const invalid = () => {
    $("#guess")
        .addClass("invalid")
        .on("animationend", () => {
            $("#guess").removeClass("invalid");
            $("#guess").prop("disabled", false);
        });
};

$(document).ready(() => {
    $("#guess").keyup(e => {
        if(e.key == "Enter") {
            socket.emit("guess", $("#guess").val());
            $("#guess").prop("disabled", true);
        }
    });
});

socket.on("setup", (first, words, definition) => {
    if(first) $(".turn").addClass("visible");

    words.forEach((word) => $("#past").prepend(createWord(word)));

    $("#last").text(capitalize(words.at(-1)));
    $("#define").text(definition);
});

socket.on("update", turn => {
    turn ? $(".turn").addClass("visible") : $(".turn").removeClass("visible");
});

socket.on("define", word => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((data) => data.json())
        .then((json) => {
            const meanings = json.reduce(
                (acc, cur) =>
                    cur.meanings.length > acc.meanings.length ? cur : acc,
                json[0]
            ).meanings;
            const meaning = meanings.reduce(
                (acc, cur) =>
                    ranking.indexOf(cur.partOfSpeech) <
                        ranking.indexOf(acc.partOfSpeech)
                        ? cur
                        : acc,
                meanings[0]
            );

            const def = meaning.definitions[0].definition;

            $("#past").prepend(createWord(word));
            $("#last").text(capitalize(word));
            $("#define").text(def);

            socket.emit("status", true, word, def);
        })
        .catch(() => {
            socket.emit("status", false, null, null);
            invalid();
        });
});

socket.on("invalid", () => {
    invalid();
});

socket.on("turn", (was, mine, word, definition) => {
    if(mine) {
        $(".turn").addClass("visible");
        $("#guess").val("");
        $("#guess").prop("disabled", false);
    } else {
        $(".turn").removeClass("visible");
    }

    if(!was) {
        $("#past").prepend(createWord(word));
        $("#last").text(capitalize(word));
        $("#define").text(definition);
    }
});
