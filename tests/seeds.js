const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("../server/db/models/Todo");
const { User } = require("../server/db/models/User");


const jwt_secret = process.env.JWT_SECRET;
let user1Id = new ObjectID();
let user2Id = new ObjectID();

let seedTodos = [{
    _id: new ObjectID(),
    text: "seed todo 1",
    _creator: user1Id
},
{
    _id: new ObjectID(),
    text: "seed todo 2",
    _creator: user2Id,
    completed: true,
    complatedAt: 333,
}];


let seedUsers = [{
    _id: user1Id,
    email: "user1@example.com",
    password: "user1Pass",
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: user1Id.toHexString(), access: "auth" }, jwt_secret)
    }]
},
{
    _id: user2Id,
    email: "user2@example.com",
    password: "user2Pass",
}];

let populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(seedTodos);
    }).then(() => done()).catch((e) => {
        done(e);
    })
}

let populateUsers = (done) => {
    User.remove({}).then(() => {
        let savePromise0 = new User(seedUsers[0]).save();
        let savePromise1 = new User(seedUsers[1]).save();
        return Promise.all([savePromise0, savePromise1]);
    }).then(() => done()).catch((e) => {
        console.log({ e });
        done(e);
    })
}

module.exports = {
    populateTodos,
    seedTodos,
    seedUsers,
    populateUsers
};