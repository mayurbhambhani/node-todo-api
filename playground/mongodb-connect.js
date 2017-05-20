const { MongoClient, ObjectId } = require("mongodb");


// es6 destructuring demo
// --begin
let user = { name: "Mayur", age: 25 };
let { name, age } = user;
console.log("name :", name);
console.log("user :", age);
// --end

// object id demo
// --begin
console.log(new ObjectId());
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log("unable to connect to mongodb server");
    }
    console.log("connected to mongodb server");

    db.collection("todos").insertOne({
        "text": "something to todo",
        "completed": false
    }, (err, result) => {
        if (err) {
            console.log("coudnt insert todo into the db", err)
        } else {
            console.log(JSON.stringify(result.ops, undefined, 3));
            console.log("Info that can be extracted from id : ", result.ops[0]._id.getTimestamp());
        }
    })
    db.close();
})