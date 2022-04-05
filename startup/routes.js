const express = require("express");
const users = require('../routes/users');
const establishments = require('../routes/establishments');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/establishments', establishments);
}