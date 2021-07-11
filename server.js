//importing express function from express module and calling the express function which returns app object
const express = require('express');
const app = express();

//specify port on which the application will listen to
const PORT = 8080;

const connectDb = require('./src/connection');
const User = require('./src/User.model');
const fs = require('fs');
const Jimp = require('jimp');

//Route 1
app.get("/", (req, res)=>{
    //res.send("Hello from Node.js app \n");
    async function addText(){
        const image = await Jimp.read('./assets/Test_png.png'); 
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        image.print(font, 0,0,{
            text:"This is to certify that You have completed this course..",
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, 1920, 1080);
        await image.writeAsync('Received.png');
        return image;
    }
    addText().then((image)=>{
        image.getBuffer(Jimp.MIME_PNG, (err, data)=>{
            if (err) return console.error(err);
            console.log("Function successfully returns");
            res.contentType('image/png');
            res.send(data);
        });
        
    });
    
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