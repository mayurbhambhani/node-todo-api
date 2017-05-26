const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

let UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email."
        },
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]

});

UserSchema.methods.toJSON = function () {
    let user = this.toObject();

    return _.pick(user, ['email', '_id']);
}

UserSchema.statics.findByToken = function (token) {
    // here this is the model and not the instance
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, "abc123");
    } catch (e) {
        // return new Promise((then, err) => {
        //     err({ err: "fuck you" });
        // })
        // shorter version
        return Promise.reject({ err: "fuck you" });
    }
    return User.findOne({
        "_id": decoded._id,
        // double quotes are compulsary when accessing variables like we have accessed token inside tokens array
        "tokens.token": token,
        "tokens.access": "auth"

    });
}
UserSchema.pre("save", function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (!err) {
                    user.password = hash;
                    next();
                } else {
                    throw new Error(err);
                }
            });
        })
    } else {
        next();
    }

})

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = "auth";
    let token = jwt.sign({ _id: user._id.toHexString(), access }, "abc123");
    user.tokens.push({ access, token });
    // returning a then. A then on then will be passed the first then's return value.
    return user.save().then(() => {
        return token;
    })
};

let User = mongoose.model('User', UserSchema);


module.exports = { User };







// let user1 = new User({
//     email: "mayur@gmail.com"
// });



// user1.save().then((doc) => {
//     console.log("saved user", doc);
// }, (err) => {
//     console.log("unable to save user", err);
// });