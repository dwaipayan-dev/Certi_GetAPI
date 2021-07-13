/*
This process will be executed using execSync function which will block the event loop until the process exits. Meaning at one time only
one certificate will be generated, other requests will have to wait.
*/
//Loading Jimp: An image processing node library
const Jimp = require('jimp');
//Getting Connection Variable
const connectDb = require('./src/connection');
//Getting User object model
const User = require('./src/User.model');

//Connecting to MongoDB...Since I am using execSync, there is no support for interprocess communication and hence I am storing the generated
//certificate to mongodb from this process only instead of passing the created image data back to parent.
connectDb().then(()=>{
    console.log("MongoDB connected");
}).catch((err)=>{
    console.err("ERROR:", err.message.toString());
});

//Fetching userName and password from command line arguments (This command was called via post request) 
const userName = process.argv[2];
const certiId = process.argv[3];

//Async function(as most of jimp functions are async but using await to maintain synchronization) to generate certificate using userName and certiId
async function addText(){
    //Using Jimp to read a white background png of size(1920x1080). I have included other background images in the assets folder.
    //If you want to change background of the certificate. simply change the file name to one of the other files in assets folder.
    const image = await Jimp.read('./assets/white-solid-bg.png'); 
    //Setting font and size
    var font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    //printing text overlay on the background hence creating certificate.
    image.print(font, 0,-50,{
        text:"This is to certify that " + userName + " has successfully completed this course from CuriousJr.",
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 1920, 1080);
    //Similarly writing certiId on certificate
    font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    image.print(font, 0,0,{
        text:"The Certificate Id is: "+certiId,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 1920, 1080);

    //Optional line for writing the image to a local file
    //await image.writeAsync('Received.png');
    
    //return jimp image instance
    return image;
}

//Calling the async function
addText().then((image)=>{
    //Getting image data from Jimp image instance
    image.getBuffer(Jimp.MIME_PNG, (err, data)=>{
        if (err) return console.error(err.message.toString());
        console.log("Function of " + userName + " successfully returns");
        //Creating new user object using user object model
        const user = new User({
            certi_id: certiId,
            holder_name: userName,
            img:{
                data: data,
                contentType: "image/png"
            }
        });
        //Saving user object to MongoDB and exiting the process
        user.save().then(()=>{
            console.log("User created");
            process.exit();
        }).catch((err)=>{
            console.log("User could not be created because of ", err.message.toString());
            process.exit(1);
        });

    });
    
});