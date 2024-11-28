const express = require('express');
const mongoose = require('mongoose');
const Carts = require('./routers/routers-carts');
const Tickets = require('./routers/routers-ticket');


const ServisCartsFunction = function(){
    const app = express();
    app.use(express.json());


    app.use('/carts', Carts);
    app.use('/tickets', Tickets);


    app.listen(process.env.PORT_ECOMMERCE, ()=>{
        console.log('Server (Servis Ecommerce) pokrenut na portu ', process.env.PORT_ECOMMERCE);
    });
};

module.exports = ServisCartsFunction;