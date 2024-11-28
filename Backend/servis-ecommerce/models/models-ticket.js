const { default: mongoose, trusted } = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        require: true,
        ref: 'Events'
    },
    quantity: {
        type: Number,
        require: true
    },
    dateTicket:{
        type: Date,
        require: true
    },
});

const Tickets = mongoose.model('Ticket', ticketSchema);

module.exports = Tickets;