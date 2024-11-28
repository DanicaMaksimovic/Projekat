const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const Ticket = require('../models/models-ticket');
const { checkToken } = require('../../servis-users/auth/auth');
const Carts = require('../models/models-cart');
const Events = require('../../servis-events/models/models-events');

router.post('/create-ticket', checkToken,async (req,res) =>{
    try{
        const userId = res.locals.user._id;

        const korpa = await Carts.findOne({
            userId: userId
        });
        if (korpa) {
            const elementi = korpa.inCart;
            const nizTiketa = [];
            for(let i=0; i < elementi.length; i++){
                nizTiketa.push({
                    userId: userId,
                    eventId: korpa.inCart[i].eventId,
                    quantity: korpa.inCart[i].quantity,
                    dateTicket: new Date()
                });
            }
            await Ticket.insertMany(nizTiketa);

            await Carts.deleteOne({userId: userId});

            res.status(200).json({
                message: "Uspeh"
            });
        } else {
            res.status(400).json({
                error: 'Korisnik ima praznu korpu'
            });
        }

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            error: error.message
        });
    }
});

router.get('/get-tickets', checkToken, async (req,res) =>{
    try{
        const userId = res.locals.user._id;
        const karte = await Ticket.find({userId: userId});
        for (let i=0; i<karte.length; i++) {
            karte[i] = await karte[i].populate("eventId");
        }
        res.status(200).json({
            karte: karte
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;