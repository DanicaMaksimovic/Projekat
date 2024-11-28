const express = require('express');
const router = express.Router();
const User = require('../models/models-user');
const {register, checkToken, checkAdmin} = require('../auth/auth');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { cache, name } = require('ejs');
const mailgun = require('mailgun-js');

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY || '0edea95af6abcfb34eb0e64218410f4a-afce6020-7d424d86',
    domain: process.env.MAILGUN_DOMAIN || 'sandboxa679fc1513624fa7ba1bb397a1769d64.mailgun.org'
});

// register
router.post('/registar', async (req,res)=>{
    try{
        const user = await register(req.body);
        res.status(201).json({
            message: "Korisnik dodat",
            added: true,
            email: user.email,
            token: user.token,
            id: user._id
        });
    }
    catch(err){        
        res.status(400).json({
            error: err.message
        });
    }
});

// read
router.get('/read', async(req,res)=>{
    try{
        const users = await User.find();
        res.send({
            name: users.name, 
            email: users.email
        });
    }
    catch(err){
        res.status(400).json({
            error: err.message
        });
    }
});

router.delete('/delete', checkToken, async (req,res) => {
    try{
        const {id} = req.body;
        const user = await User.findOne({_id: id});
        if(user){
            await User.updateOne(
                { "_id" : user._id.toString() },
                { $set: { "isDeleted" : true , "token": null} }
            );
            return res.status(200).json({
                message : "Korisnik obrisan"
            });
        } else {
            res.status(400).json({
                message: "Greska: nije pronadjen korisnik"
            })
        }
    }
    catch(error){
        res.status(400).json({
            error: error
        });
    }
});

// brisanje korisnika od strane administratora
router.delete('/admindelete',checkAdmin,checkToken, async (req,res) =>{
    try{
        const user = await User.findOne({_id: idToDelete});
    if(user){
        await User.updateOne(
            { "_id" : idToDelete },
            { $set: { "isDeleted" : true , "token": null} }
        );
        return res.status(200).json({
            message : "Korisnik obrisan od strane administratora " + res.locals.admin.email
        });
    } else {
        return res.status(400).json({
            message: "Greska: nije pronadjen korisnik"
        })
    }
    }
    catch(error){
        res.status(400).json({
            error: error
        });
    }
});

// od regularnog korisnika napraviti administratora, samo administrator moze da poziva ovu metodu
router.post('/reg-to-admin',checkAdmin,checkToken, async (req,res) =>{
    changeUserType(req,res,1);
});

// od regularnog korisnika napraviti administratora, samo administrator moze da poziva ovu metodu
router.post('/admin-to-reg',checkAdmin,checkToken, async (req,res) =>{
    changeUserType(req,res,0);
});

async function changeUserType (req,res, type) {
    const idToChange = req.body.idToChange;
    if (idToChange === undefined || idToChange === null) {
        return res.status(400).json({
            error: "Nije postavljen ID"
        });
    }

    const user = await User.findOne({_id: idToChange});
    if(user){
        await User.updateOne(
            { "_id" : idToChange },
            { $set: { "type" : type } }
        );
        let poruka;
        if (type === 1) {
            poruka = "Korisnik je promovisan u administratora od strane " + res.locals.admin.email;
        } else {
            poruka = "Korisnik je degradiran od strane " + res.locals.admin.email + " administratora";
        }
        return res.status(200).json({
            message : poruka
        });
    } else {
        return res.status(400).json({
            message: "Greska: nije pronadjen korisnik"
        })
    }
}

router.post('/login', async (req,res) =>{
    try{
        const {email, password} = req.body;
        if(email == undefined || password == undefined){
            return res.status(400).json({
                error: 'Polja su obavezna'
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                error: 'Ne postoji korisnik sa datim email-om'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                error: 'Ne ispravan password'
            });
        }

        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET, {expiresIn: '10h'}); 
        await User.updateOne(
            { "email" : user.email },
            { $set: { "token" : token , "isDeleted": false} }
        );

        res.json({token: token, id: user._id, type: user.type});
    }
    catch(error){
        res.status(500).json({
            error: error.message
        });
    }
});

function generateHTML(template, replacements){
    return template.replace(/{{(.*?)}}/g, (match, p1) => replacements[p1.trim()]);
};
    
async function sendMail (name, email, forgotPasswordLink) {

    const emailTemplate = 
        `
        <h1>Dobrodosli, {{ name }} !</h1>
        <p>Molimo Vas da resetujete lozinku klikom na link ispod</p>
        <a href="{{ forgotPasswordLink }}"> Resetovanje lozinke </a>
        `;
const emailHTML = generateHTML(emailTemplate, {name, forgotPasswordLink});
    const data = {
       from : 'TicketApp <noreply@yourDomain.com>',
       to : email,
       subject : 'Resetovanje lozinke',
       html: emailHTML
    };
    await mg.messages().send(data);

};

// poziva se kada korisnik unese email i stisne dugme forgot password
router.post('/forgot-password-init',async (req,res) =>{
    try{
        const {email} = req.body;
    if(!validator.isEmail(email)){
       return res.status(400).json({
        error: "Email nije validan"
       });
    }
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(400).json({
            error: "Korisnik nije pronadjen"
        }); 
    }
    const token = jwt.sign({email: user.email, changePassword: true},process.env.JWT_SECRET, {expiresIn: '10m'}); 
    user.passwordToken = token;
    const forgotPasswordLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${email}`;

    sendMail(user.name, email, forgotPasswordLink);

    await user.save(); 
    res.status(200).json({
        message: "radi"
    });
    }
    catch(error){
        res.status(400).json({
            error: error
        });
    }
});

function dekodovanToken (token){
    return jwt.verify(token, process.env.JWT_SECRET);
}

// poziva se kada korisnik sleti na stranicu za proveru lozinke
router.post('/forgot-password-check-access',async (req,res) =>{
    try{
        const {email, passwordToken} = req.body;
        const user = await User.findOne({email: email, passwordToken: passwordToken});
        if(!user){
            return res.status(400).json({
                status: false,
                error: "Korisnik nije pronadjen"
            }); 
        }
        try {
            dekodovanToken(passwordToken);
        } catch(e){
            user.passwordToken = null;
            await user.save();
            return res.status(400).json({
                status: false,
                error: "Password token nije dekodovan"
            }); 
        }
        return res.status(200).json({
            status: true,
            message: "Dozvoljen pristup"
        }); 
        }
    catch(error){
            res.status(400).json({
                error: error
            });
        }
});

// poziva se kada korisnik zaista unese lozinku i klikne na dugme 'change password'
router.post('/forgot-password-change',async (req,res) =>{
    const {email, passwordToken, password} = req.body;
    const user = await User.findOne({email: email, passwordToken: passwordToken});
    if(!user){
        return res.status(400).json({
            error: "Korisnik nije pronadjen"
        }); 
    }
    try {
        dekodovanToken(passwordToken);
    } catch(e){
        user.passwordToken = null;
        await user.save();
        return res.status(400).json({
            error: "Password token nije dekodovan"
        }); 
    }
    user.passwordToken = null;
    user.password = password;
    await user.save();
    res.status(200).json({
        message: "Password promenjen"
    });
});

//update date
router.post('/update-data', checkToken,async (req,res)=>{
    try{
        const id = res.locals.user._id;
    const {name,surname,email} = req.body;
    if(name === undefined || name === null){
        return res.status(400).json({
            error: "Ime nije prosledjeno"
        });
    } else if(name === ""){
        return res.status(400).json({
            error: "Ime ne moze biti prazno"
        });
    }
    if(surname === undefined || surname === null){
        return res.status(400).json({
            error: "Prezime nije prosledjeno"
        });
    } else if (surname === ""){
        return res.status(400).json({
            error: "Prezime ne moze biti prazno"
        });
    }
    if (!validator.isEmail(email)){
        return res.status(400).json({
            error: "Email nije u dobrom formatu"
        });
    }
    await User.findOneAndUpdate( {_id: id}, { $set: {name: name, surname: surname, email: email}});
    res.status(200).json({
        message: "Podaci su promenjeni"
    });
    }
    catch(error){
        res.status(400).json({
            error: error
        });
    }
});
//update password
router.post('/update-password', checkToken, async(req,res)=>{
    try{
        const id = res.locals.user._id;
        let {password} = req.body;
        if(password === undefined || password === null){
            return res.status(400).json({
                error: "Password nije prosledjen"
            });
        } else if (password === ""){
            return res.status(400).json({
                error: "Password ne moze biti prazan"
            });
        }
        const salt =await bcrypt.genSalt(10);
        password =await bcrypt.hash(password, salt);
        await User.findOneAndUpdate( {_id: id}, { $set: {password: password}});
        res.status(200).json({
            message: "Password je promenjen"
        });
    }
    catch(error){
        res.status(400).json({
            error: error
        });
    }
});

router.post('/logout',  checkToken, async (req,res,next)=>{
    try{
        const {email} = req.body;
        const v = await User.findOneAndUpdate({email}, { $set: {token: null} });
        console.log(User.findOneAndUpdate, v);

        res.status(200).json({message: "uspelo"});
    }
    catch(error){
        res.status(400).json({
            error: error
        });
    }
});


router.post("/provera", checkToken, async (req, res) => {
    return res.status(200).json();    
})

module.exports = router;