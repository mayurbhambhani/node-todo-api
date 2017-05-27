const { User } = require("./../db/models/User");


let authenticate = (req, res, next) => {
    let token = req.get('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject({ err: "user not found" });
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(e);
    });
}

module.exports = {
    authenticate,
}
