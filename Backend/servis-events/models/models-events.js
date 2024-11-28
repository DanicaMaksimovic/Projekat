const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');

const eventsSchema = new mongoose.Schema({
    category: {
        type: Number, // 0 - koncert, 1 - stand-up komedija
        default: 0
    },
    name : {
        type: String, 
        required:[true, 'Ime je obavezno'],
        minlength:[10, 'Ime mora da sadrzi {MINLENGTH}']
    },
    date:{
        type: Date,
        required: [true, 'Datum je obavezan'],
    },
    location: {
        type: String,
        required: [true, 'Lokacija je obavezna']
    },
    qrcode:{
        type: String,
        required: [true, 'Polje je obavezno']
    },
    price: {
        type: Number,
        required: [true, 'Cena je obavezna']
    },
    description: {
        type: String,
        required: [true, 'Polje je obavezno']
    },
    linkedEvents: {
        type: Array,
        default: []
    },
    picture: {
        type: String
    }
});

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;