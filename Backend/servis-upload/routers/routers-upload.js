const express = require('express');
const { checkToken, checkAdmin } = require('../../servis-users/auth/auth');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Events = require('../../servis-events/models/models-events');

const createEventDirectory = (eventId) => {
    const eventDir = path.join(__dirname, 'uploads',  "events", eventId);
    if(!fs.existsSync(eventDir)){
        fs.mkdirSync(eventDir,{recursive: true});
    }
};

router.post('/', async (req,res) =>{
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            error: 'No file attached'
        });
    }

    // provere
    let fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    let maxFileSize = 10 * 1024*1024; //10mb
    if(!fileTypes.includes(req.files.file.mimetype)){
        return res.status(400).json({
            error: 'bed request - format not good'});
    }
    if(maxFileSize < req.files.file.size){
        return res.status(400).json({
            error: 'bed request - max size not good'});
    }
    ///
    const file = req.files.file;
    const eventId = req.body.eventId;


    // da li u bazi postoji event
    const event = await Events.findOne({_id: eventId});
    if(!event){
        return res.status(400).json({
            error: "Dogadjaj nije pronadjen"
        }); 
    } 
    createEventDirectory(eventId);

    const uploadPath = path.join(__dirname, 'uploads', "events", eventId, file.name);
    //skladistenje

    file.mv(uploadPath, async (err) => {
        if(err){
            return res.status(500).json({
                error: err
            });
        } else {
            await Events.findOneAndUpdate({
                _id: eventId
            }, {
                $set: { picture: file.name }
            });
            res.status(200).json({
                message: 'ok'
            });
        }
    });

});

module.exports = router;