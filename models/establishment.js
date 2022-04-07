const mongoose = require('mongoose');
const Joi = require('joi');

const Establishment = mongoose.model('Establishment', new mongoose.Schema({
    name: {
        maxlength: 50,
        minlength: 4,
        required: true,
        unique: true,
        type: String,
    },
    image: {
        maxlength: 1024,
        minlength: 4,
        required: true,
        type: String,
    },
    location: {
        maxlength: 50,
        minlength: 4,
        required: true,
        type: String,
    },
    food: [Object],
}));

function validateEstablishment(establishment) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(50).required(),
        image: Joi.string().min(4).max(1024).required(),
        location: Joi.string().min(4).max(50).required(),
        food: Joi.array(),
    });

    return schema.validate(establishment);
}

module.exports.Establishment = Establishment;
module.exports.validate = validateEstablishment;