const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { Establishment } = require('../models/establishment');

router.get('/', auth, async (req, res) => {
    const establishments = await Establishment.find({});
    res.send(establishments);
});

module.exports = router;