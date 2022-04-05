const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        maxlength: 50,
        minlength: 4,
        required: true,
        type: String,
    },
    email: {
        maxlength: 255,
        minlength: 4,
        required: true,
        unique: true,
        type: String,
    },
    password: {
        maxlength: 1024,
        minlength: 4,
        required: true,
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}));

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().email().min(4).max(255).required(),
        password: Joi.string().min(4).max(1024).required(),
        isAdmin: Joi.boolean(),
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;