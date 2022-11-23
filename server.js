const express = require("express");
const contactDB = require('./config/db')

contactDB();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json({extended:false}));
app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/contacts',require('./routes/contacts'));




app.listen(PORT,() =>{
    console.log(`the server is running at port ${PORT}`);
})