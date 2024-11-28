const express = require('express');
const { checkAdmin, checkToken } = require('../../servis-users/auth/auth');
const Events = require('../models/models-events');
const User = require('../../servis-users/models/models-user');
const Carts = require('../../servis-ecommerce/models/models-cart');
//const Carts = require('../../servis-ecommerce/models/models-cart');
const router = express.Router();

router.get('/get-events',async (req,res) =>{
    try{
        const events = await Events.find();
        res.status(200).json({
            events: events
        });
    }
    catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/get-events-by-category', async (req,res)=>{
    try{
        const {category} = req.body;
        let categoryNumber = -1;
        if (category === "CONCERTS") {
            categoryNumber = 0;
        } else if (category === "STANDUP") {
            categoryNumber = 1;
        }
        if (categoryNumber === -1) {
            return res.status(400).json({
                error: "Kategorija ne postoji"
            });
        }

        const events = await Events.find({category: categoryNumber});
        res.status(200).json({
            events: events
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

router.get('/get-event-by-id',async (req,res) =>{
    try{
        const idEvent = req.body.idEvent;
        const event = await Events.find({_id: idEvent});
        res.status(200).json({
            idEvent: idEvent,
            event: event
        })
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

router.post('/create-event',checkToken,checkAdmin,async (req,res)=>{
    try{
        const {category, name, date, location, qrcode, price, description, picture, linkedEvents} = req.body;
        const linkedEventsIds = [];
        for (let i=0; i<linkedEvents.length; i++) {
            linkedEventsIds.push(linkedEvents[i]._id);
        }
        const newEvent = new Events({category, name, date, location, qrcode, price, description, picture, 
            linkedEvents: linkedEventsIds});
        await newEvent.save();
        res.status(200).json({
            message: 'unet dogadjaj',
            event: newEvent
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

router.post('/edit-event',checkToken,checkAdmin, async (req,res)=>{
    try{
        const {category, name, date, location, qrcode, price, description, picture, linkedEvents} = req.body;
        const linkedEventsIds = [];
        for (let i=0; i<linkedEvents.length; i++) {
            linkedEventsIds.push(linkedEvents[i]._id);
        }
        const eventId = req.body.eventId;
        await Events.findOneAndUpdate( {_id: eventId}, { $set: {category: category,name: name, date:date, location: location,
        qrcode:qrcode, price:price, description:description, picture:picture, linkedEvents: linkedEventsIds}});

        res.status(200).json({
            message: 'Dogadjaj upisan'
        })
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});

router.delete('/delete-event',checkToken,checkAdmin,async (req,res)=>{
    try{
        const{idEvent} = req.body;
        await Events.findOneAndDelete({_id: idEvent});
        // obrisati iz korpe ovaj dogadjaj svim korisnicima
        const vrednost = await Carts.updateMany(
            { 'inCart.eventId': idEvent },  
            { $pull: { inCart: { eventId: idEvent } } }
        );
        await Carts.deleteMany({
            inCart: { $size: 0 }
        });
        res.status(200).json({
            message: 'Dogadjaj je obrisan'
        });
    }
    catch(error){
        res.status(400).json({
            error: error.message
        });
    }
});


module.exports = router;