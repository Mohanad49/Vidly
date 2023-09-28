const mongoose = require('mongoose');
const Joi = require('joi');

// Schema of customer
const customerSchema = new mongoose.Schema({
    name: {type: String , required:true , minlength:5 , maxlength:50},
    isGold: {type: Boolean, default:false},
    phone: {type: String , required:true , minlength:5 , maxlength:50 }
})
function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        isGold: Joi.boolean().default(false),
        phone: Joi.string().required().min(5).max(50)
    });
    return schema.validate(customer);
}

const Customer = mongoose.model('Customer' , customerSchema);

exports.Customer = Customer ;
exports.validate = validateCustomer;