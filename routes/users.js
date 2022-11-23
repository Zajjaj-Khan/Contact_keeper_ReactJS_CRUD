const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const route = express.Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const config = require('config')

// @route /api/users
// @desc used to registor a user...
// @access Private

route.post('/',[
    check("name","Please add your name").not().isEmpty(),
    check("email","Please enter your email").isEmail(),
    check("passward","Please enter 6 or more character passwrd").isLength({min:6})
], async (req,res)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }

const {name,email,passward} = req.body;

try {
    let user = await User.findOne({email});
    if(user){
        res.status(400).json({msg:"User already exists"});
    }
    user = new User({
        name,
        email,
        passward
    });
    const salt = await bcrypt.genSalt(10);
    user.passward = await bcrypt.hash(passward,salt);

    await user.save();

    
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
    res.status(500).send("Sever error ")
}


});

module.exports = route;