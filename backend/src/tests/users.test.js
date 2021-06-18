const request = require("supertest");
const app = require("../app");
const { User } = require("../models/user");
const { setupDatabase, userOne, resetDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("should signup a new user", async () => {
    const response = await request(app)
        .post("/api/v1/users/register")
        .send({
            "name": "Deepak Thapa",
            "email": "deepakthapa@gmail.com",
            "password": "12345678",
            "phone": "7838626816",
        })
        .expect(200);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.data.user.id);
    expect(user).not.toBeNull();

    // Assert about the response
    expect(response.body.data.user).toMatchObject({
        "name": "Deepak Thapa",
        "email": "deepakthapa@gmail.com",
        "phone": "7838626816",
        "isAdmin": false,
        "street": "",
        "apartment": "",
        "zip": "",
        "city": "",
        "country": ""
    });
});

test("Should not signup user with invalid name/email/password", async () => {
    // invalid email
    await request(app)
        .post("/api/v1/users/register")
        .send({
            "name": "Deepak Thapa",
            "email": "deepakthapa.com",
            "password": "12345678",
            "phone": "7838626816",
        })
        .expect(404);

    // invalid name
    await request(app)
        .post("/api/v1/users/register")
        .send({
            "email": "deepakthapa@gmail.com",
            "password": "12345678",
            "phone": "7838626816",
        })
        .expect(404);
    // invalid password
    await request(app)
        .post("/api/v1/users/register")
        .send({
            "name": "Deepak Thapa",
            "email": "deepakthapa@gmail.com",
            "password": "1234",
            "phone": "7838626816",
        })
        .expect(404);
});

test("should login existing user", async () => {
    const response = await request(app)
        .post("/api/v1/users/login")
        .send({
            email: userOne.email,
            password: userOne.passwordHash
        })
        .expect(200);
    await User.findById(userOne._id);
    expect(response.body.data.token).not.toBeNull()
});

test("should not login non existing user", async () => {
    await request(app)
        .post("/api/v1/users/login")
        .send({
            email: userOne.email,
            password: "notmypass"
        })
        .expect(400);
});

afterAll(resetDatabase)