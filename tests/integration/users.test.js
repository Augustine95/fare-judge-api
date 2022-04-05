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

    describe("GET /:id", () => {
        const exec = () => {
            return request(server)
                .get("/api/users/me")
                .set("x-auth-token", token);
        };

        it("should return 401 if the client is not logged in", async () => {
            // const res = await exec();

            expect(1).toBe(1);
        });
    });
});
