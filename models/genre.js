const mongoose = require('mongoose');
const Joi = require('joi');

// Schema of genres
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})
function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50)
    });
    return schema.validate(genre);
}

const Genre = mongoose.model('Genre' , genreSchema);

exports.Genre = Genre ;
exports.genreSchema = genreSchema;
exports.validateGenre = validateGenre ;