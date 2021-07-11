const Jimp = require('jimp');

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
    });abc
    
});