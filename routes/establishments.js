const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const { Establishment, validate } = require('../models/establishment');
const validator = require('../middleware/validate');

router.get('/', async (req, res) => {
    const establishments = await Establishment.find({});
    res.send(establishments);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const establishment = await Establishment.findById(req.params.id);

    if (!establishment)
        return res.status(404).send("The establishment with the given ID was found.");

    res.send(establishment);
});

router.post('/', [auth, validator(validate)], async (req, res) => {
    const establishment = new Establishment({
        name: req.body.name,
        image: req.body.image,
        location: req.body.location
    });
    await establishment.save();

    res.send(establishment);
});

router.put('/:id', [auth, validateObjectId, validator(validate)], async (req, res) => {
    const establishment = await Establishment.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        location: req.body.location
    }, { new: true });

    if (!establishment) return res.status(404).send('The establishment with the given ID was not found.');

    res.send(establishment);
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const establishment = await Establishment.findByIdAndRemove(req.params.id);

    if (!establishment) return res.status(404).send('The establishment with the given ID was not found.');

    res.send(establishment);
});

module.exports = router;