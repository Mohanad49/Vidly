const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Customer, validate } = require('../models/customer') ;
const auth = require('../middleware/auth');

// Customer Endpoints
router.get('/' , async (req,res) => {
    const customers = await Customer.find().sort('name') ;
    res.send(customers) ;
})
router.get('/:id' , async (req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer...');
    const customer = await Customer.findById({_id: req.params.id}) ;
    if(!customer) return res.status(404).send('Customer not found...') ;
    res.send(customer) ;
})
router.post('/' ,auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer = new Customer(req.body) ;
    await customer.save() ;
    res.send(customer) ;
})
router.put('/:id' ,auth, async (req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer...');
    const customer = await Customer.findByIdAndUpdate(req.params.id , {isGold: true},
         {new: true}) ;
    if(!customer) return res.status(404).send('Customer not found...') ;
    res.send(customer) ;
})
router.delete('/:id' ,auth, async (req,res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Invalid customer...');
    const customer = await Customer.findByIdAndDelete(req.params.id) ;
    if(!customer) return res.status(404).send('Customer not found...');
    res.send(customer) ;
})
module.exports = router ;