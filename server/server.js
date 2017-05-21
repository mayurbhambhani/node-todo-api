let env = process.env.NODE_ENV || "development";
console.log({ env });

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";

}

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { mongoose } = require("./db/mongoose");
const { User } = require("./db/models/User");
const { Todo } = require("./db/models/Todo");



const port = process.env.PORT;


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


app.delete("/todos/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({ error: `Invalid id:${req.params.id}.` });
    }
    Todo.findByIdAndRemove(
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

app.patch("/todos/:id", (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({ error: `Invalid id:${req.params.id}.` });
    }
    let update = _.pick(req.body, ['text', 'completed']);
    if (_.isBoolean(update.completed) && update.completed) {
        update.completedAt = new Date().getTime();
    } else {
        update.completed = false;
        update.completedAt = null;
    }

    Todo.findByIdAndUpdate(
        req.params.id, { $set: update }, { new: true }).then((todo) => {
            if (!todo) {
                return res.status(404).send({ error: `Id ${req.params.id} not found.` });
            }
            res.send(todo);
        })
        .catch((e) => {
            console.log("unable to update todos", e);
            res.status(400);
        })
});

app.listen(port, () => {
    console.log("listening on", port);
})


module.exports = { app };









