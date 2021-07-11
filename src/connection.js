const mongoose = require('mongoose');
const User = require('./User.model');

const connUri = "mongodb://localhost:27017/certiDB";

const connectDb = () =>{
    return mongoose.connect(connUri);
};

module.exports = connectDb;