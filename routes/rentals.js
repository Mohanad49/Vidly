const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Rental, validateRental } = require('../models/rental') ;
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');

// Rental Endpoints
router.post('/' ,auth, async (req,res) => {
    const { error } = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    if(!mongoose.Types.ObjectId.isValid(req.body.customerId)) 
        res.status(400).send('Invalid customer...');
    if(!mongoose.Types.ObjectId.isValid(req.body.movieId)) 
        res.status(400).send('Invalid Movie...');    
    const customer = await Customer.findById(req.body.customerId) ;
    if(!customer) return res.status(400).send('Invalid customer...') ;
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie...') ;
    if(movie.numberInStock === 0) return res.status(400).send('Movie unavailable in stock...');
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    })
    try{
        movie.numberInStock -- ;
        movie.save();
        await rental.save() ;
        res.send(rental) ;
    }
    catch(ex){
        res.status(500).send('Something went wrong...');
    }
})
router.get('/', async (req,res) => {
    const rental = await Rental.find() ;
    res.send(rental);
})
router.delete('/:id' ,auth, async (req,res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid Rental...');
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if(!rental) return res.status(404).send('Rental not found...');
    res.send(rental);
})
module.exports = router ;