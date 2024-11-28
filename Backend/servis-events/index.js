const express = require('express');
const mongoose = require('mongoose');
const events = require('./routers/routers-events');
const cors = require("cors");


const ServisEventsFunction = function(){
    const app = express();
    app.use(express.json());
    app.use(cors({ origin: 'http://localhost:3000' }));

    app.use('/event', events);

    app.listen(process.env.PORT_EVENTS, ()=>{
        console.log('Server (Servis Events) pokrenut na portu ', process.env.PORT_EVENTS);
    });
};

module.exports = ServisEventsFunction;