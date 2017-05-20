const mongoose = require("mongoose");

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});


module.exports = { User };







// let user1 = new User({
//     email: "mayur@gmail.com"
// });



// user1.save().then((doc) => {
//     console.log("saved user", doc);
// }, (err) => {
//     console.log("unable to save user", err);
// });