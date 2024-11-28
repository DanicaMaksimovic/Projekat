const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongooseDB = require('./config/db');
const user = require('./routers/routers-user');
require('dotenv').config();
const cors = require('cors');

const ServisUsersFunction = function(){
    const app = express();
    app.use(express.json());
    app.use(cors({ origin: 'http://localhost:3000' }));
    
    app.use('/user', user);


    app.listen(process.env.PORT_USERS, ()=>{
        console.log('Server (Servis Users) pokrenut na portu ', process.env.PORT_USERS);
    });
};
module.exports = ServisUsersFunction;