const express = require("express"),
    sqlite = require("sqlite"),
    bodyParser = require("body-parser"),
    fs = require('fs'),
    func = require("./scripts/functions.js"),
    app = express(),
    cambridge = sqlite.open("./Databases/Cambridge.db"),
    rawdata = fs.readFileSync("./Databases/GTrans.json"),
    gtrans = JSON.parse(rawdata);


app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("home");
})

app.post("/result", async function (req, res) {
    var dictionary = req.body.dictionary;
    var text = req.body.text
    var rawWords = func.parse(text);
    var onlyWords = func.fullParse(text);
    console.log(dictionary);
    dict = await getDefinitions(onlyWords, rawWords, dictionary)
    res.render("result", { dict: dict });
})

app.listen(process.env.PORT || 3000, function () {
    console.log("PORT: 3000");
})

async function getDefinitions(words, rawWords, dict) {
    var dictionary = [];
    switch (dict) {
        case "Cambridge":
            {
                db = await cambridge;
                for (let i = 0; i < words.length; i++) {
                    var result = await db.get("SELECT word, definition FROM Dictionary WHERE word = ? ", words[i]);
                    if (result) {
                        dictionary.push({ word: rawWords[i], definition: result.definition });
                    }
                    else {
                        dictionary.push({ word: rawWords[i], definition: false })
                    }
                }
            }

            break;

        case "GTrans":
            {
                console.log("HERE");
                console.log(gtrans["dog"])
                words.forEach(function (word, i) {
                    if (gtrans[word]) {
                        dictionary.push({ word: rawWords[i], definition: gtrans[word] });
                    }
                    else {
                        dictionary.push({ word: rawWords[i], definition: false })
                    }
                })
            }
            break;
    }


    return dictionary;
}