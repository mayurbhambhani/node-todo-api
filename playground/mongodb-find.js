const { MongoClient, ObjectId } = require("mongodb");

console.log("");
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log("unable to connect to mongodb server");
    }
    console.log("connected to mongodb server");

    db.collection("todos").findOne({
        "text": "something to todo",
        "completed": false
    }, (err, result) => {
        debugger;
        if (err) {
            console.log("coudnt insert todo into the db", err)
        } else {
            debugger;
            console.log(JSON.stringify(result, undefined, 3));
        }
    });

    db.collection("todos").find().count().then((count) => {
        console.log("count", count);
    }, (err) => {
        if (err) {
            console.log("coudnt insert todo into the db", err)
        }
    });
    db.collection("todos").find({ completed: true }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 3));
    }, (err) => {
        if (err) {
            console.log("coudnt insert todo into the db", err)
        }
    });


    db.collection("todos").find({ _id: new ObjectId("591fe1ab54e67a708aa0085e") }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 3));
    }, (err) => {
        if (err) {
            console.log("coudnt insert todo into the db", err)
        }
    });
    db.close();
});