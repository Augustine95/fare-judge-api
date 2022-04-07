const request = require("supertest");
const { User } = require("../../models/user");

describe("/api/users", () => {
    let server;
    let token;

    beforeEach(() => {
        server = require("../../server");
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await User.deleteMany({});
    });

    describe("GET /me", () => {
        const exec = () =>
            request(server).get("/api/users/me").set("x-auth-token", token);

        it("should return 401 if the client is not logged in", async () => {
            token = "";

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 400 if the token is invalid", async () => {
            token = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should retrieve the user from the database", async () => {
            const res = await exec();

            expect(res.body).not.toBeNull();
        });
    });

    describe("POST /", () => {
        let email;
        let user;

        beforeEach(async () => {
            email = "augustineawuori95@gmail.com";
            user = new User({
                email,
                name: "123456",
                password: "123456",
            });
            await user.save();
        });

        afterEach(async () => {
            await User.deleteMany({});
            await server.close();
        });

        const exec = () => {
            return request(server)
                .post("/api/users")
                .send({ name: "Augustine", email, password: "123456" });
        };

        it("should return 400 if the user with the given ID already exist.", async () => {
            email = "";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 400 if user email already exist", async () => {
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should save the user if input is valid", async () => {
            await exec();

            const result = await User.findById(user._id);

            expect(result).toBeDefined();
        });

        it("should return the user if input is valid", async () => {
            email = "john@gmail.com";

            const res = await exec();

            expect(res.body).toBeDefined();
        });

        it("should return 200 if input is valid", async () => {
            email = "john@gmail.com";

            const res = await exec();

            expect(res.status).toBe(200);
        });
    });
});
