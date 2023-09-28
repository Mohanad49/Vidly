const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');

// Movie Endpoints
router.get('/' , async(req,res) => {
    const movies = await Movie.find().sort('title') ;
    res.send(movies) ;
})
router.get('/:id' , async(req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid Movie...');
    const movie = await Movie.findById(req.params.id) ;
    if(!movie) return res.status(404).send('Movie not Found...') ;
    res.send(movie) ;
})
router.post('/' ,auth, async(req,res) => {
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    if(!mongoose.Types.ObjectId.isValid(req.body.genreId))
        return res.status(400).send('Invalid Genre...');
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre does not exist...') ;
    const movie = new Movie({
        title: req.body.title,
        genre: new Genre({
            _id: genre._id,
            name: genre.name}),
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie) ;
})
router.put('/:id' ,auth, async(req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid Movie...');
    const movie = await Movie.findByIdAndUpdate(req.params.id ,{
            title: req.body.title}, {new: true});
    if(!movie) return res.status(404).send('Movie not Found...') ;
    res.send(movie);
})
router.delete('/:id' ,auth, async (req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid Movie...');
    const movie = await Movie.findByIdAndDelete(req.params.id) ;
    if(!movie) return res.status(404).send('Movie not Found...') ;
    res.send(movie) ;
})
module.exports = router;