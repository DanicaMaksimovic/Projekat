const express = require('express');
const { checkToken } = require('../../servis-users/auth/auth');
const Carts = require('../models/models-cart');
const { model } = require('mongoose');
const Events = require('../../servis-events/models/models-events');
const { createOrUpdateCart } = require('../functions');
const router = express.Router();


router.post('/create-cart',checkToken,async (req,res) =>{
    try{
        const {eventId,quantity} = req.body;
        const userId = res.locals.user._id;

        // Provera da li event uopste postoji u bazi
        const event = await Events.findOne({_id: eventId});
        if (!event) {
            return res.status(400).json({
                error: "Event koji dodajete u korpu ne postoji"
            });
        }

        // Provera da li je quantity veci od 0
        if (quantity <= 0) {
            return res.status(400).json({
                error: "Kolicina mora biti striktno veca od 0"
            });
        }
        
        const retCart = await createOrUpdateCart(eventId, userId, quantity, true);
        
        res.status(200).json({
            message: 'Dogadjaj uspesno dodat u korpu',
            cart: retCart
        })
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

router.post('/edit-cart', checkToken,async (req,res) =>{
    try{
        const {eventId,quantity} = req.body;
        const userId = res.locals.user._id;

        // Provera da li event uopste postoji u bazi
        const event = await Events.findOne({_id: eventId});
        if (!event) {
            return res.status(400).json({
                error: "Event koji menjate ne postoji u korpi"
            });
        }

        const retCart = await createOrUpdateCart(eventId, userId, quantity, false);
        
        res.status(200).json({
            message: 'Dogadjaj uspesno izmenjen u korpi',
            cart: retCart
        })
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

// isprazni sve sto je u korpi za ulogovanog korisnika
router.delete('/empty-cart', checkToken,async (req,res) =>{
    try{
        const userId = res.locals.user._id;
        const vrednost = await Carts.deleteOne({userId: userId});
        if (vrednost.deletedCount === 0) {
            return res.status(400).json({
                error: "Korpa je vec prazna"
            });
        }
        res.status(200).json({
            message: "Uspesno ste ispraznili korpu"
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

// brisanje pojedinacnog eventa iz korpe za ulogovanog korisnika
router.delete('/delete-event-from-cart', checkToken,async (req,res) =>{
    try{
        const userId = res.locals.user._id;
        const eventId = req.body.eventId;

        const vrednost = await Carts.findOneAndUpdate(
            { userId: userId, 'inCart.eventId': eventId },  
            { $pull: { inCart: { eventId: eventId } } }, 
            { new: true } 
        );
        if (vrednost === null) {
            return res.status(400).json({
                error: "Nije pronadjen dogadjaj za ulogovanog korisnika"
            });
        }
        if (vrednost.inCart.length === 0) {
            await Carts.deleteOne({userId: userId});
        }
        res.status(200).json({
            message: "Uspesno ste ispraznili dogadjaj iz korpe"
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});
// izracunava ukupnu cenu (uzima iz models-events.js)
router.post("/total-cart", checkToken, async (req, res) =>{
    try{
        const userId = res.locals.user._id
        const povratnaVrednost = {
            items: [],
            totalAmount: 0
        };

        let korpa = await Carts.findOne(
            { userId: userId }
        );
        if (korpa === null){
            return res.status(200).json({                
                ...povratnaVrednost
            });
        } else {
            korpa = await korpa.populate("inCart.eventId");
            const dogadjaji = korpa.inCart;
            for (let i=0; i < dogadjaji.length; i++) {
                const cena = dogadjaji[i].eventId.price;
                povratnaVrednost.totalAmount +=  cena * dogadjaji[i].quantity;
            }
            povratnaVrednost.items = dogadjaji;
        }
        
        res.status(200).json({
            message: "Uspesno",
            ...povratnaVrednost
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;