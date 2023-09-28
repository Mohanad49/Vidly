const Joi = require('joi');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');

router.post('/' , [auth, validate(validateReturn)], async (req, res) => {
    if(!req.body.customerId) return res.status(400).send('CustomerId not provided');
    if(!req.body.movieId) return res.status(400).send('MovieId not provided');

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if(!rental) return res.status(404).send('Rental not found');
    if(rental.dateReturned) return res.status(400).send('Return already processed');

    rental.return();
    await rental.save();

    await Movie.findByIdAndUpdate(rental.movie._id, {
        $inc: {numberInStock: 1}
    });
    
    return res.send(rental);
})

function validateReturn(genre){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(genre);
}

module.exports = router;