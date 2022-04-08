const Joi = require('joi');
const mongoose = require('mongoose');

const Review = mongoose.model("Review", new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            email: {
                maxlength: 255,
                minlength: 4,
                required: true,
                type: String,
            },
        }),
        required: true
    },
    establishment: {
        type: new mongoose.Schema({
            name: {
                maxlength: 50,
                minlength: 4,
                required: true,
                type: String,
            },
        }),
        required: true
    },
    review: {
        required: true,
        type: Object
    }
}));

function validateReview(review) {
    const schema = Joi.object({
        userId: Joi.objectId().required(),
        establishmentId: Joi.objectId().required(),
        review: Joi.object().required()
    });

    return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validate = validateReview;