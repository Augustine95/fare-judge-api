const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const { Establishment } = require("../models/establishment");
const { validate, Review } = require("../models/review");
const validator = require("../middleware/validate");
const { User } = require("../models/user");

router.get('/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    let establishment = null;
    if (!user) {
        establishment = await Establishment.findById(id);
        if (!establishment) return res.status(404).send("Reviews with the given ID was not found.");
    }

    const reviews = await Review.findById(id);
    res.send(reviews);
});

router.post("/", [auth, validator(validate)], async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user.");

    const establishment = await Establishment.findById(req.body.establishmentId);
    if (!establishment) return res.status(400).send("Invalid establishment.");

    const review = new Review({
        user: { _id: user._id, email: user.email },
        establishment: { _id: establishment._id, name: establishment.name },
        review: req.body.review,
    });

    res.send(review);
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const review = await Review.findByIdAndRemove(req.params.id);
    if (!review) return res.status(404).send("The review with the given ID was not found.");

    res.send(review);
});

router.put('/:id', [auth, validateObjectId, validator(validate)], async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user.");

    const establishment = await Establishment.findById(req.body.establishmentId);
    if (!establishment) return res.status(400).send("Invalid establishment.");

    const review = await Review.findByIdAndUpdate(req.params.id, {
        user: { _id: user._id, email: user.email },
        establishment: { _id: establishment._id, name: establishment.name },
        review: req.body.review
    }, { new: true });

    if (!review) return res.status(404).send("The review with the given ID was not found.");

    res.send(review);
});

module.exports = router;
