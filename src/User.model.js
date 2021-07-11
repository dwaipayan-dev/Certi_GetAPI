const mongoose = require('mongoose');
//User schema prototype
const userSchema = new mongoose.Schema({
    certi_id:{
        type: String
    },
    name:{
        type: String
    },
    /*
    img:{
        type: Buffer
    }
    */
});

//User object
const User = mongoose.model("User", userSchema);

module.exports = User;