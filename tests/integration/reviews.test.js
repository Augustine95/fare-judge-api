const mongoose = require("mongoose");
const request = require("supertest");
const { Establishment } = require("../../models/establishment");
const { User } = require("../../models/user");
const { Review } = require("../../models/review");

describe("/api/reviews", () => {
    let server;
    let review;
    let reviewId;
    let establishment;
    let user;

    beforeEach(async () => {
        server = require("../../server");
        establishment = new Establishment({
            name: "establishment1",
            image: "12345",
            location: "12345",
        });
        await establishment.save();
        user = new User({
            email: "john@gmail.com",
            name: "123456",
            password: "123456",
        });
        await user.save();
        review = new Review({
            user: { email: user.email },
            establishment: { name: establishment.name },
            review: {},
        });
        await review.save();
        reviewId = review._id;
    });

    afterEach(async () => {
        await Establishment.deleteMany({});
        await User.deleteMany({});
        await server.close();
    });

    const exec = async () =>
        await request(server)
            .get("/api/reviews/" + reviewId)
            .set("x-auth-token", user.generateAuthToken())
            .send({
                userId: user._id,
                establishmentId: establishment._id,
                review: {},
            });

    describe("api/reviews", () => {
        describe("GET /:id", () => {
            it("should return 404 if the review id is invalid.", async () => {
                reviewId = '';

                const res = await exec();

                expect(res.status).toBe(404);
            });

            it("should return 404 if review with the given ID was not found.", async () => {
                reviewId = mongoose.Types.ObjectId();

                const res = await exec();

                expect(res.status).toBe(404);
            });

            it("should return the review with the given ID.", async () => {
                const res = await exec();

                console.log("REV", review);
                expect(res.status).toBe(200);
                expect(res.body).not.toBeNull();
                expect(res.body).toHaveProperty('_id');
                expect(res.body).toHaveProperty('user');
                expect(res.body).toHaveProperty('establishment');
            });
        });
    });
});
