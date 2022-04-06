const express = require("express");
const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");
const router = express.Router();
const validator = require("../middleware/validate");
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", validator(validate), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exist.");

    user = new User(_.pick(req.body, ["username", "email", "name"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res
        .header("x-auth-token", token)
        .send(_.pick(req.body, ["username", "email", "name"]));
});

module.exports = router;
