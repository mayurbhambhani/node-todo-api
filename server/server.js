const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

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
        console.log("unable to save todo");
        res.status(400);
        res.send(err);
    });

});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send(todos);
    }).catch((e) => {
        console.log("unable to fetch todos");
        res.status(400);
    })
});

app.get("/todos/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({ error: `Invalid id:${req.params.id}.` });
    }
    Todo.findById(
        req.params.id, (err, todo) => {
            if (!todo) {
                return res.status(404).send({ error: `Id ${req.params.id} not found.` });
            }
            res.send(todo);
        }
    ).catch((e) => {
        console.log("unable to fetch todos");
        res.status(400);
    })
});



app.listen(port, () => {
    console.log("listening on", port);
})


module.exports = { app };









