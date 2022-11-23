const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    passward:{
        type: String,
        required: true
    },
    Date:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user',UserSchema);
