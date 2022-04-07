const express = require("express");
const users = require('../routes/users');
const establishments = require('../routes/establishments');
const reviews = require('../routes/reviews');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/establishments', establishments);
    app.use('/api/reviews', reviews);
}