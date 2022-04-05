const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();
const { Establishment } = require('../models/establishment');

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

module.exports = router;