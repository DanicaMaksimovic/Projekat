const express = require('express');
const mongoose = require('mongoose');
const upload = require('../servis-upload/routers/routers-upload');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require("cors");

const ServisUploadFunction = function() {
    const app = express();
    app.use(express.json());

    app.use(fileUpload({
        limits: { fileSize: 2 * 1024 * 1024 }, // 3
        abortOnLimit: true,
      }));
    app.use(cors({ origin: 'http://localhost:3000' }));

    app.use('/slike', express.static(path.join(__dirname, 'routers', 'uploads')));

    app.use('/upload', upload);    

    app.listen(process.env.PORT_UPLOAD, ()=>{
        console.log('Server (Servis Upload) pokrenut na portu ', process.env.PORT_UPLOAD);
    });
}

module.exports = ServisUploadFunction;