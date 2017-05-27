const request = require("supertest");
const expect = require("expect");
const { ObjectID } = require("mongodb");
const _ = require("lodash");


const { Todo } = require("../server/db/models/Todo");
const { populateTodos, seedTodos, seedUsers, populateUsers } = require("./seeds.js");

describe("server", () => {
    let app = require("../server/server").app;

    beforeEach(populateTodos);

    beforeEach(populateUsers);
    it("add todo", (done) => {
        let todoJson = { 'text': 'wake up chotu' };
        request(app)
            .post("/todos")
            .send(todoJson)
            .expect(200)
            .expect((res) => {

                //console.log(JSON.stringify(res, undefined, 3));
                expect(JSON.parse(res.text)).toInclude(todoJson);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find(todoJson)
                    .then((docs) => {
                        expect(docs.length).toBe(1);
                        expect(docs[0]).toInclude(todoJson);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
            });
    });



    it("add empty todo", (done) => {
        let todoJson = {};
        request(app)
            .post("/todos")
            .send(todoJson)
            .expect(400)
            .end((err, res) => {
                Todo.find(todoJson)
                    .then((docs) => {
                        expect(docs.length).toBe(2);
                        done();
                    }).catch((err) => {
                        done(err);
                    });

            });
    });


    it("test list todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .end((err, res) => {
                // console.log("response", res.body);
                expect(res.body.length).toBe(2);
                done();
            });
    });

    it("test fetch todo by id", (done) => {
        {
            let id = seedTodos[0]._id;
            request(app)
                .get(`/todos/${id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    // console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text)._id).toEqual(seedTodos[0]._id);
                    done();
                });

        }


    });
    // 59208e80545a6434f233ac1e

    it("test fetch todo with non-existent id", (done) => {

        let id = seedTodos[0]._id;
        let id_prefix = parseInt(id.toHexString().substr(0, 1));
        let new_id_prefix = id_prefix + 1;
        let new_id = new ObjectID(new_id_prefix + id.toHexString().substr(1));
        //console.log(id, new_id)
        request(app)
            .get(`/todos/${new_id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    done();
                }
            });

    });


    it("test fetch todo with invalid id", (done) => {

        let id = "invalid_mongo_id";
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                }
                done();
            });

    });

    // -----------
    it("test delete todo by id", (done) => {
        {
            let id = seedTodos[0]._id;
            request(app)
                .delete(`/todos/${id}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    // console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text)._id).toEqual(seedTodos[0]._id);
                    done();
                });

        }


    });
    // 59208e80545a6434f233ac1e

    it("test delete todo with non-existent id", (done) => {

        let id = seedTodos[0]._id;
        let id_prefix = parseInt(id.toHexString().substr(0, 1));
        let new_id_prefix = id_prefix + 1;
        let new_id = new ObjectID(new_id_prefix + id.toHexString().substr(1));
        //console.log(id, new_id)
        request(app)
            .delete(`/todos/${new_id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    done();
                }
            });

    });


    it("test delete todo with invalid id", (done) => {

        let id = "invalid_mongo_id";
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                }
                done();
            });

    });

    // --------------------
    it("test patch todo by id with completed false", (done) => {
        {
            let todoJson = { 'text': 'wake up chotu' };
            let id = seedTodos[0]._id;
            request(app)
                .patch(`/todos/${id}`)
                .send(todoJson)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    // console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text).text).toEqual(todoJson.text);
                    expect(JSON.parse(res.text).completed).toBeA('boolean').toBe(false);
                    expect(JSON.parse(res.text).completedAt).toBe(null);
                    done();
                });

        }


    });

    it("test patch todo by id with completed true", (done) => {
        {
            let todoJson = { 'text': 'wake up chotu', "completed": true };
            let id = seedTodos[0]._id;
            request(app)
                .patch(`/todos/${id}`)
                .send(todoJson)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    // console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text).text).toEqual(todoJson.text);
                    expect(JSON.parse(res.text).completed).toBeA('boolean').toBe(true);
                    expect(JSON.parse(res.text).completedAt).toBeA('number');
                    done();
                });

        }


    });
    // 59208e80545a6434f233ac1e

    it("test patch todo with non-existent id", (done) => {

        let id = seedTodos[0]._id;
        let id_prefix = parseInt(id.toHexString().substr(0, 1));
        let new_id_prefix = id_prefix + 1;
        let new_id = new ObjectID(new_id_prefix + id.toHexString().substr(1));
        //console.log(id, new_id)
        request(app)
            .patch(`/todos/${new_id}`)
            .send({})
            .expect(404)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    done();
                }
            });

    });


    it("test patch todo with invalid id", (done) => {

        let id = "invalid_mongo_id";
        request(app)
            .patch(`/todos/${id}`)
            .send({})
            .expect(404)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                }
                done();
            });

    });

    describe("GET /users/me", () => {
        it("positive test case", (done) => {
            {
                let token = seedUsers[0].tokens[0].token;
                //console.log({ token });
                request(app)
                    .get(`/users/me`)
                    .set('x-auth', token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            done(err);
                        }
                        // console.log("response", JSON.stringify(res));
                        expect(JSON.parse(res.text)._id).toEqual(seedUsers[0]._id);
                        done();
                    });

            }


        });

        it("negative test case", (done) => {
            {
                let token = "wrong token";
                //console.log({ token });
                request(app)
                    .get(`/users/me`)
                    .set('x-auth', token)
                    .expect(401)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            done(err);
                        }
                        // console.log("response", JSON.stringify(res));
                        expect(JSON.parse(res.text)).toEqual({ err: "fuck you" });
                        done();
                    });

            }


        });
    });

    describe("POST /users/login", () => {
        it("positive test case", (done) => {
            let user = _.pick(seedUsers[1], ['email', 'password']);
            //console.log({ token });
            request(app)
                .post(`/users/login`)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text)._id).toEqual(seedUsers[1]._id);
                    done();
                });
        });

        it("negative test case", (done) => {
            let token = "wrong token";
            //console.log({ token });
            let user = _.pick(seedUsers[1], ['email', 'password']);
            user.email = "a@b.c";
            //console.log({ token });
            request(app)
                .post(`/users/login`)
                .send(user)
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    // console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text)).toEqual({ err: "user not found!!" });
                    done();
                });
        });

        it("negative test case", (done) => {
            let token = "wrong token";
            //console.log({ token });
            let user = _.pick(seedUsers[1], ['email', 'password']);
            user.password = "a@b.c";
            //console.log({ token });
            request(app)
                .post(`/users/login`)
                .send(user)
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    // console.log("response", JSON.stringify(res));
                    expect(JSON.parse(res.text)).toEqual({ err: "Incorrect password!!" });
                    done();
                });
        });
    });

});



