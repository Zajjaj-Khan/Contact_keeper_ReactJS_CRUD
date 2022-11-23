const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/User');
const Contact = require('../model/contact');
const auth = require('../middleware/auth');


// @route GET /api/contacts
// @desc  get all user add contact
//@access private

route.get('/',auth, async(req,res)=>{
    try {
        const contact = await Contact.find({user:req.user.id}).sort({date:-1});
        res.json(contact)
    } catch (err) {
        console.error(err.message);
        res.status(401).json("Invalid request!")
        
    }
     


});

// @route post /api/contacts
// @desc add new contact 
// @access private

route.post('/',[auth,[
    check('name','Please enter your name').not().isEmpty(),
    check('phone','Please enter phone number').not().isEmpty()
]],async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()})
    }
    const {name,phone,type,email} = req.body;

    const addContact = new Contact({
        name,
        phone,
        email,
        type,
        user:req.user.id
    });

    const contact = await addContact.save();

    res.json(contact);
});

// @route GET /api/auth/:id
// @desc  get the logged in user
//@acess private
route.put('/:id',auth,async(req,res)=>{
    
    const {name,phone,type,email} = req.body;
        const contactFeilds={};
        if(name) contactFeilds.name=name;
        if(email) contactFeilds.email=email;
        if(phone) contactFeilds.phone=phone;
        if(type)  contactFeilds.type= type;
    try {
        
        let contact = await Contact.findById(req.params.id);

        if(!contact){
            return res.status(404).send("Not Found")
        }


        //make sure user is authorized!
        if(contact.user.toString() !== req.user.id){
            res.status(401).json("User unautherized")
        }
        contact = await Contact.findByIdAndUpdate(req.params.id,
            {$set:contactFeilds},
            {new:true},
            
            )
        res.json(contact)
        

    } catch (err) {
        console.error(err.message);
        res.status(401).json("Invalid request!")
    }

});

// @route GET /api/auth
// @desc  get the logged in user
//@acess private
route.delete('/:id',auth,async(req,res)=>{
    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact){
            return res.status(404).send("Not Found")
        }


        //make sure user is authorized!
        if(!contact.user.toString()== req.params.id){
            res.status(401).json("User unautherized")
        }
        await Contact.findByIdAndRemove(req.params.id);

        res.send("Contact Deleted")
        

    } catch (err) {
        console.error(err.message);
        res.status(401).json("Invalid request!")
    }
    res.send('delete a contact ')
});

module.exports = route