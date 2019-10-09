module.exports = {
    parse: function (input) {
        var result = input.split(" ");
        return result;
    },
    fullParse: function (input) {
        input = input.replace(/[^a-zA-Z ]/g, "")
        input = input.toLowerCase();
        input = input.split(" ");
        return input;
    }
};