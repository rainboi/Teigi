const express = require("express"),
    sqlite = require("sqlite"),
    bodyParser = require("body-parser"),
    func = require("./scripts/functions.js"),
    app = express(),
    dbPromise = sqlite.open("CambridgeDict.db");


app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("home");
})

app.post("/result", async function (req, res) {
    var text = req.body.text
    var rawWords = func.parse(text);
    var onlyWords = func.fullParse(text);
    dict = await getDefinitions(onlyWords, rawWords)
    res.render("result", { dict: dict });
})

app.listen(process.env.PORT || 3000, function () {
    console.log("PORT: 3000");
})

async function getDefinitions(words, rawWords) {
    var dictionary = [];
    db = await dbPromise;
    for (let i = 0; i < words.length; i++) {
        var result = await db.get("SELECT word, definition FROM Dictionary WHERE word = ? ", words[i]);
        if (result) {
            dictionary.push({ word: rawWords[i], definition: result.definition });
        }
        else {
            dictionary.push({ word: rawWords[i], definition: false })
        }
    }

    return dictionary;
}