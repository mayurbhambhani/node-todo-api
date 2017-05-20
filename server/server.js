const express = require("express");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const { User } = require("./db/models/User");
const { Todo } = require("./db/models/Todo");

const port = process.env.PORT || 3000;


let app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("todo rest api is up. Dont doubt the server for your screw ups")
});

app.post("/todos", (req, res) => {
    let todo = new Todo({
        text: req.body.text,
    });
    todo.save().then((doc) => {
        console.log("saved todo", doc);
        res.send(doc);
    }, (err) => {
        console.log("unable to save to do");
        res.status(400);
        res.send(err);
    });

})



app.listen(3000, () => {
    console.log("listening on 3000");
})


module.exports = { app };









