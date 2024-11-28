require('dotenv').config();
const bcrybt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const User = require('../models/models-user');
const { text } = require('express');

//middleware 
async function checkToken(req, res, next) {
    const {id} = req.body;
    if (id === undefined || id === null) {
        res.status(400).json({
            error: "Missing id"
        });
        return;
    }
    const token = req.headers.authorization;
    try {
        const dekodovaniObjekat = jwt.verify(token, process.env.JWT_SECRET);
        const dekodovaniUserId = dekodovaniObjekat.userId;
        const user = await User.findOne({_id: dekodovaniUserId});
        res.locals.user = user;
        if (user) {
            if (id === user._id.toString()) {
                next(); 
                return;               
            } else {
                res.status(400).json({
                    error: "Poslati id se ne poklapa sa id u bazi"
                });
                return;
            }
        } else {
            res.status(400).json({
                error: "Korisnik sa dekodovanim id = " + dekodovaniUserId + " ne postoji"
            });
            return;
        }
    } catch(e) {
        console.log(e);
        res.status(400).json({
            error: "Nije ispravno dekodovan token"
        });
        return;
    }
    next();
}

//
async function checkAdmin(req, res, next) {
    const id = req.body.id;
    try{
        const user = await User.findOne({_id: id});
        // prenosimo promenljive iz jedne funkcije u drugu
        res.locals.admin = user;
        if(!user){
            return res.status(400).json({
                error: "Korisnik nije pronadjen"
            }); 
        }
        if(user.type === 1){
            next();
        }else {
            res.status(400).json({
                error: "Nije administrator"
            })
        }
    }
    catch(e){
        res.status(400).json({
            error: "Greska"
        });
    }
};

async function register(uData){
    const {name, email, surname, password} = uData;
    const existingU = await User.findOne({email});
    if(existingU){
        throw new Error("Korisnik sa tom email adresom vec postoji");
    }
    
    const newUser = new User({name, email, surname, password}); 
    newUser.token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET, {expiresIn: '10h'});    
    await newUser.save(); 

    return newUser;
};

module.exports = {register, checkToken, checkAdmin};