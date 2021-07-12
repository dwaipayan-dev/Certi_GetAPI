const mongoose = require('mongoose');
//User schema prototype
const userSchema = new mongoose.Schema({
    certi_id: String,
    holder_name: String,
    img:{
        data: Buffer,
        contentType: String
    }
});

//User object
const User = mongoose.model("User", userSchema);

module.exports = User;