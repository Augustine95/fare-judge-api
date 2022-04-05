const request = require('supertest');
const { User } = require('../../models/user');

describe('auth middleware', () => {
    let server;
    let token;

    beforeEach(() => {
        server = require('../../server');
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    const exec = () => {
        return request(server)
            .get('/api/establishments')
            .set('x-auth-token', token);
    };

    it('should return 401 if token is not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 1;

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});