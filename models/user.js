const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const config = require('config');

// Schema of User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        minlength: 5 ,
        maxlength: 1024,
        required: true
    },
    isAdmin: Boolean
});
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().email().required().min(5).max(255),
        password: Joi.string().required().min(5).max(255)
    });
    return schema.validate(user);
} 

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id , isAdmin: this.isAdmin} , config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

exports.User = User ;
exports.validate = validateUser ;