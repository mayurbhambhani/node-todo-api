//config should be the first module to load
const config = require('./config/config');

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");


const { mongoose } = require("./db/mongoose");
const { User } = require("./db/models/User");
const { Todo } = require("./db/models/Todo");
const { authenticate } = require("./middleware/authenticate");



const port = process.env.PORT;


let app = express();

app.use(bodyParser.json());

app.get("/",
    (req, res) => {
        res.send("todo rest api is up. Dont doubt the server for your screw ups")
    });

app.post("/todos", authenticate, (req, res) => {
    let user = req.user;
    let todo = new Todo({
        text: req.body.text,
        _creator: user._id,
    });
    todo.save().then((doc) => {
        //console.log("saved todo", doc);
        res.send(doc);
    }, (err) => {
        //console.log("unable to save todo");
        res.status(400);
        res.send(err);
    });

});

app.post("/users", (req, res) => {
    let userJson = _.pick(req.body, ['email', 'password'])
    let user = new User(userJson);
    user.save().then(() => {
        return user.generateAuthToken();

    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        //console.log("unable to save user", err);
        res.status(400).send(err);
    });

});

app.post("/users/login", (req, res) => {
    let userJson = _.pick(req.body, ['email', 'password'])
    User.findByCredentials(userJson).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });

    }).catch((err) => {
        //console.log("Error while logging in", err);
        res.status(401).send(err);
    })
});


app.delete("/users/me/token", authenticate, (req, res) => {
    let token = req.token;
    let user = req.user;
    user.deleteToken(token).then(() => {
        res.send({ msg: "You are now logged out. See you soon!!" })
    }).catch((err) => {
        res.status(401);
    });
});

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.get("/todos", authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send(todos);
    }).catch((e) => {
        // console.log("unable to fetch todos");
        res.status(400);
    })
});

app.get("/todos/:id", authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({ error: `Invalid id:${req.params.id}.` });
    }
    Todo.findOne(
        { _id: req.params.id, _creator: req.user._id }, (err, todo) => {
            if (!todo) {
                return res.status(404).send({ error: `Id ${req.params.id} not found.` });
            }

            res.send(todo);
        }
    ).catch((e) => {
        //console.log("unable to fetch todos");
        res.status(400);
    })
});


app.delete("/todos/:id", authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send({ error: `Invalid id:${req.params.id}.` });
    }

    Todo.findOneAndRemove(
        { _id: req.params.id, _creator: req.user._id }, (err, todo) => {
            if (!todo) {
                return res.status(404).send({ error: `Id ${req.params.id} not found.` });
            }
            res.send(todo);
        }
    ).catch((e) => {
        //console.log("unable to fetch todos");
        res.status(400);
    })
});

app.patch("/todos/:id", authenticate, (req, res) => {
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

    Todo.findOneAndUpdate(
        { _id: req.params.id, _creator: req.user._id }, { $set: update }, { new: true }).then((todo) => {
            if (!todo) {
                return res.status(404).send({ error: `Id ${req.params.id} not found.` });
            }
            res.send(todo);
        })
        .catch((e) => {
            //console.log("unable to update todos", e);
            res.status(400);
        })
});

app.listen(port, () => {
    console.log("listening on", port);
})


module.exports = { app };









