const request = require("supertest");
const expect = require("expect");
const { ObjectID } = require("mongodb");

const { Todo } = require("../server/db/models/Todo");

describe("server", () => {
    let app = require("../server/server").app;
    let seedTodos = [{
        _id: new ObjectID(),
        text: "seed todo 1"
    },
    {
        _id: new ObjectID(),
        text: "seed todo 2"
    }];
    beforeEach((done) => {
        Todo.remove({}).then(() => {
            return Todo.insertMany(seedTodos);
        }).then(() => done()).catch((e) => {
            done(e);
        })
    });
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

});

