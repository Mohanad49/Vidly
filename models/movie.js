const mongoose = require('mongoose');
const { genreSchema, validate } = require('./genre');
const Joi = require('joi');

// Schema of movies
const movieSchema = new mongoose.Schema({
    title: {
        type: String ,
        trim: true,
        required: true ,
        minlength: 5,
        maxlength: 255
    } ,
    genre: {
        type: genreSchema,
        required: true
     },
    numberInStock: {
        type: Number ,
        required: true ,
        min: 0 ,
        max: 255
    },
    dailyRentalRate: {
        type: Number ,
        required: true ,
        min: 0 ,
        max: 255
    }
})
function validateMovie(movie){
    const innerSchema = Joi.object({
        name: Joi.string().required().min(5).max(50)
    });
    const schema = Joi.object({
        title: Joi.string().trim(true).required().min(5).max(255),
        genre: innerSchema,
        numberInStock: Joi.number().required().min(0).max(255),
        dailyRentalRate: Joi.number().required().min(0).max(255)
    })
    return schema.validate(movie);
}

const Movie = mongoose.model('Movie' , movieSchema) ;

exports.Movie = Movie ;
exports.validateMovie = validateMovie ;