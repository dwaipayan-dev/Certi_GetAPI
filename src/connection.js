//loading mongoose and User Object model
const mongoose = require('mongoose');
const User = require('./User.model');

//Setting connection URl
const connUri = "mongodb://mongo:27017/certiDB";

//For local testing
//const connUri = "mongodb://localhost:27017/certiDB";

//Function to connect to database
const connectDb = () =>{
    return mongoose.connect(connUri);
};

module.exports = connectDb;