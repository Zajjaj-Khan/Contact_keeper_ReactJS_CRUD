const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongooseURI')

const contactDB = async() =>{
    try {
      await  mongoose.connect(db)
      console.log("Mongoose connected ....");
    } catch (error) {
        console.log(message.err);
        process.exit(1);
    }

    
};

module.exports = contactDB
