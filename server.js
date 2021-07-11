//importing express function from express module and calling the express function which returns app object
const express = require('express');
const app = express();

//specify port on which the application will listen to
const PORT = 8080;

const connectDb = require('./src/connection');
const User = require('./src/User.model');
//Route 1
app.get("/", (req, res)=>{
    res.send("Hello from Node.js app \n");
});

app.get("/user-create", (req, res)=>{
    const user = new User({
        certi_id: "certi-5428967",
        name: "Garuda"
    })
    user.save().then(()=>{
        console.log("User created");
        res.send("Success");
    }).catch((err)=>{
        console.log("User could not be created because of ", err);
        res.send("Failure");
    })
})

//app listener for requests
app.listen(PORT, function(){
    console.log('Listening on port', PORT);
    connectDb().then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.log("ERROR:", err);
    });
});