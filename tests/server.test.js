const request = require("supertest");
const expect = require("expect");

const { Todo } = require("../server/db/models/Todo");

describe("server", () => {
    let app = require("../server/server").app;

    beforeEach((done) => {
        Todo.remove({}).then(() => done());
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
                        expect(docs.length).toBe(0);
                        done();
                    }).catch((err) => {
                        done(err);
                    });

            });
    });
});
