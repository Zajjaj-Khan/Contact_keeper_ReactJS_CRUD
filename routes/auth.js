const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth')

// @route GET /api/auth
// @desc  get the logged in user/provide token to looged in used!* checks token*
// access Private

route.get('/',auth,async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-passward');
        res.json(user);
        
    } catch (err) {
        console.error(err.message)
        res.status(401).send('Access defined, not a valid token')
    }
   



});

// @route post /api/auth
// @desc  allow new user 
//@ access Public
route.post('/',[
    check('email','Enter your email').isEmail(),
    check('passward','Enter valid passward')
], async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    };
    const {email,passward} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({msg:'invalid credentails'})
        }
        const isMatch = await bcrypt.compare(passward,user.passward);

        if(!isMatch){
            res.status(400).json({msg:'Invaild credentials'});
        }
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn:3600
        },(err,token)=>{
            if(err) throw err;
            res.json({token})
        });



    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg:"server err"})
        
    }
    
  
});

module.exports = route;