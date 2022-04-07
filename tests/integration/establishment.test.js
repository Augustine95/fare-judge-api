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
    const exec = () => request(server).get("/api/establishments/");

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

    afterEach(async () => {
      await Establishment.deleteMany({});
    });

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
    let name;
    let token;

    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "establishment1";
    });

    afterEach(async () => {
      await User.deleteMany({});
      await Establishment.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .post("/api/establishments")
        .set("x-auth-token", token)
        .send({ name, image: "12345", location: "12345" });
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
      name = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the establishment if is valid", async () => {
      await exec();

      const result = await Establishment.findOne({ name });

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("name", name);
    });

    it("should return the establishment if is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });

  describe("PUT /:id", () => {
    let name;
    let token;
    let establishment;

    beforeEach(async () => {
      name = "establishment1";
      establishment = new Establishment({
        name,
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
        .put("/api/establishments/" + establishment._id)
        .set("x-auth-token", token)
        .send({ name, image: "12345", location: "12345" });
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token is provided", async () => {
      token = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if the establishment with the given ID was not found", async () => {
      await Establishment.deleteOne({ name });

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the updated establishment.", async () => {
      const res = await exec();

      expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", name);
      expect(res.body).toHaveProperty("location");
      expect(res.body).toHaveProperty("image");
    });

    it("should return 200 if input is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });
});
