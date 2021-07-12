
const Jimp = require('jimp');
const connectDb = require('./src/connection');
const User = require('./src/User.model');


connectDb().then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
    console.log("ERROR:", err);
});


const userName = process.argv[2];
const certiId = process.argv[3];


async function addText(){
    const image = await Jimp.read('./assets/white-solid-bg.png'); 
    var font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    image.print(font, 0,-50,{
        text:"This is to certify that " + userName + " has successfully completed this course from CuriousJr.",
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 1920, 1080);

    font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    image.print(font, 0,0,{
        text:"The Certificate Id is: "+certiId,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 1920, 1080);

    //await image.writeAsync('Received.png');
    return image;
}

addText().then((image)=>{
    image.getBuffer(Jimp.MIME_PNG, (err, data)=>{
        if (err) return console.error(err);
        console.log("Function of " + userName + " successfully returns");
        const user = new User({
            certi_id: certiId,
            holder_name: userName,
            img:{
                data: data,
                contentType: "image/png"
            }
        });
        user.save().then(()=>{
            console.log("User created");
            process.exit();
        }).catch((err)=>{
            console.log("User could not be created because of ", err);
            process.exit();
        });

    });
    
});