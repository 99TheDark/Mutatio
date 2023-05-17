const fetch = require("node-fetch");
const lemmatize = require("wink-lemmatizer");

const ranking = ["conjunction", "article", "noun", "adjective", "pronoun", "verb", "adverb", "interjection"];

// Levenshtein distance algorithm
const compare = (a, b) => {
    if(b.length == 0) {
        return a.length;
    } else if(a.length == 0) {
        return b.length;
    } else if(a[0] == b[0]) {
        return compare(a.substring(1), b.substring(1));
    } else {
        return 1 + Math.min(
            compare(a.substring(1), b),
            compare(a, b.substring(1)),
            compare(a.substring(1), b.substring(1))
        );
    }
};

const define = async word => {
    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if(data.status != 200) return null;

    const json = (await data.json())[0];
    const meanings = json.meanings;

    const meaning = meanings.reduce(
        (acc, cur) => ranking.indexOf(cur.partOfSpeech) < ranking.indexOf(acc.partOfSpeech) ? cur : acc,
        meanings[0]
    );
    const definitions = meaning.definitions;

    return {
        definitions: definitions,
        first: definitions[0].definition,
        count: definitions.length,
        random: () => definitions[Math.floor(Math.random() * definitions.length)].definition
    };
};

module.exports = {
    compare: compare,
    define: define
};