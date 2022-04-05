const request = require("supertest");
const { User } = require("../../models/user");
const { Establishment } = require("../../models/establishment");

describe("/api/users", () => {
    let server;
    let token;

    beforeEach(() => {
        server = require("../../server");
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Establishment.deleteMany({});
        await server.close();
    });

    describe("GET /", () => {
        const exec = () => {
            return request(server)
                .get("/api/establishments/")
                .set("x-auth-token", token);
        };

        it("should return 401 if the client is not logged in", async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return all establishments', async () => {
            const establishments = [
                { name: 'establishment1', image: '12345', location: '12345' },
                { name: 'establishment2', image: '12345', location: '12345' },
            ];
            await Establishment.collection.insertMany(establishments);

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(e => e.name === 'establishment1')).toBeTruthy();
            expect(res.body.some(e => e.name === 'establishment2')).toBeTruthy();
        });
    });
});
