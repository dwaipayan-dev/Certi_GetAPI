//importing express function from express module and calling the express function which returns app object
const express = require('express');
const app = express();

//specify port on which the application will listen to
const PORT = 8080;

const connectDb = require('./src/connection');
const User = require('./src/User.model');
const fs = require('fs');
const Jimp = require('jimp');
const child = require('child_process');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Route 1
app.get("/", (req, res)=>{
    res.send("Hello! Welcome to Certificate Generator");
});


app.post('/generate-certi', (req, res) =>{
    var uname = req.body.name;
    var uid = Math.random().toString(28).substring(2);
    var result = child.execSync('node certi_generate.js "'+uname+'" "'+uid+'"').toString();
    console.log(result);
    var fetchObj = User.findOne({
        certi_id: uid,
        holder_name: uname
    });
    fetchObj.exec((err, user)=>{
        if(err){
            console.error(err.message.toString());
            res.status(404).send("Error:" + err.message.toString());
        }
        res.status(200).contentType(user.img.contentType).send(user.img.data);
    });

})

app.get('/get-certi', (req, res)=>{
    var uid = req.query.certi_id;
    var fetchObj = User.findOne({
        certi_id: uid,
    });
    fetchObj.exec((err, user)=>{
        if(err){
            console.error(err);
            res.status(404).send("Error:" + err.message.toString());
        }
        res.status(200).contentType(user.img.contentType).send(user.img.data);
    });
})

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