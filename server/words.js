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

module.exports = compare;