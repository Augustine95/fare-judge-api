const request = require("supertest");
const { Establishment } = require("../../models/establishment");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

describe("/api/establishments", () => {
  let server;

  beforeEach(() => {
    server = require("../../server");
  });

  afterEach(async () => {
    await Establishment.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    const exec = () => {
      return request(server).get("/api/establishments/");
    };

    it("should return all establishments", async () => {
      const establishments = [
        { name: "establishment1", image: "12345", location: "12345" },
        { name: "establishment2", image: "12345", location: "12345" },
      ];
      await Establishment.collection.insertMany(establishments);

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((e) => e.name === "establishment1")).toBeTruthy();
      expect(res.body.some((e) => e.name === "establishment2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    let id;

    const exec = () => request(server).get("/api/establishments/" + id);

    it("should return an establishment if the id is valid", async () => {
      const establishment = new Establishment({
        name: "establishment1",
        image: "12345",
        location: "12345",
      });
      await establishment.save();

      id = establishment._id;
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should return 400 if  invalid id is passed", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no establishment with the given ID exist.", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let establishment;
    let token;

    beforeEach(async () => {
      establishment = new Establishment({
        name: "establishment1",
        image: "12345",
        location: "12345",
      });
      await establishment.save();
      token = new User().generateAuthToken();
    });

    afterEach(async () => {
      await User.deleteMany({});
      await Establishment.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .post("/api/establishments")
        .set("x-auth-token", token)
        .send({ establishment });
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if token is invalid", async () => {
      token = "a";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if input is invalid", async () => {
      establishment = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // it("should save the establishment if is valid", async () => {
    //   await exec();

    //   const result = await Establishment.findById(establishment._id);

    //   expect(result).not.toBeNull();
    //   expect(result).toHaveProperty("_id");
    //   expect(result).toHaveProperty("name", establishment.name);
    //   expect(result).toHaveProperty("location", establishment.location);
    //   expect(result).toHaveProperty("image", establishment.image);
    // });

    it("should return the establishment if is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });
});
