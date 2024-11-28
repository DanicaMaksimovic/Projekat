const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const config = require('../config/db');

const userSchema = new mongoose.Schema({
    type: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    token:{
        type: String,
        default: null
    },
    passwordToken: {
        type: String,
        default: null
    },
    name : {
        type: String, 
        required:[true, 'Ime je obavezno'],
        minlength:[3, 'Ime mora da sadrzi {MINLENGTH}']
    },
    surname:{
        type: String,
        required: [true],
        minlength: [5, 'Prezime morada da sadrzi {MINLENGTH}']
    },
    email: {
        type: String, 
        required: [true, 'Email je obavezan'], 
        lowercase: true, validate:[validator.isEmail, "Unesite vazeci email"]},
        password: {type: String,
        required: [true, 'Lozinka je obavezna'], 
        minlength: [8, `Password mora da sadrzi {MINLENGTH}`]},
});

userSchema.pre('save',async function (next){
    if(this.isModified('password') || this.isNew){
        const salt =await bcrypt.genSalt(10);
        this.password =await bcrypt.hash(this.password, salt);
    }
    if (typeof this.password !== 'string') {
        throw new Error('Password must be a string');
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;