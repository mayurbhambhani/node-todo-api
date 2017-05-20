const mongoose = require("mongoose");

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true

    },
    completed: {
        type: Boolean,
        default: false,
        required: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = { Todo };




// let todo1 = new Todo({
//     text: "Cook dinner"
// })

// todo1.save().then((doc) => {
//     console.log("saved todo", doc);
// }, (err) => {
//     console.log("unable to save to do");
// });

// let todo2 = new Todo({
//     text: "Cook dinner",
//     completed: false,
//     completedAt: new Date().getTime()
// })



// todo2.save().then((doc) => {
//     console.log("saved todo", doc);
// }, (err) => {
//     console.log("unable to save to do");
// });


// let todo3 = new Todo({
//     text: " ",
//     completed: false,
//     completedAt: new Date().getTime()
// })



// todo3.save().then((doc) => {
//     console.log("saved todo", doc);
// }, (err) => {
//     console.log("unable to save to do", err);
// });

