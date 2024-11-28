const { name } = require('ejs');
const { default: mongoose } = require('mongoose');

const cartsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    inCart: [{
        eventId:{type: String, required: [true, 'Polje je obavezno'], ref: "Events" },
        quantity:{type: Number, required: [true, 'Polje je obavezno']}
    }]
});

const Carts = mongoose.model('Carts', cartsSchema);

module.exports = Carts;