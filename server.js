//importing express function from express module and calling the express function which returns app object
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

//Code below is to set all request headers to use content-type = application/json instead of application/formurl encoded
app.use(function (req, res, next) {
    req.headers['content-type'] = 'application/json';
    next();
  });

//extensions to parse json encoded and urlencoded req body
//Note To self: Always remember to put all the use() as soon as we define the app variable. Doesn't work otherwise
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//specify port on which the application will listen to
const PORT = 8080;

//loading connection variable from connection.js
const connectDb = require('./src/connection');

//loading user object model
const User = require('./src/User.model');

//loading child_process object to implement multiprocessing
const child = require('child_process');

//loading JOI for validation 
const Joi = require('joi');

//Route 1-Welcome route
app.get("/", (req, res)=>{
    res.send("Hello! Welcome to Certificate Generator");
});

//Route 2-Certificate generation route
app.post('/generate-certi', (req, res) =>{

    console.log(req.headers);
    console.log(req.body);

    var uname = req.body.name;

    //Validating username
    let val_result = validateFields({username: uname});
    if(val_result.error){
        console.log(val_result.error.details);
        res.status(400).send("Name in the request body is not valid");
    }
    else{
        //Creating unique id
        var uid = Math.random().toString(28).substring(2);

        //Using execSync() for synchronous multiprocessing. execSync() blocks the event loop until the process returns so at one time only one
        //certificate generates
        var result = child.execSync('node certi_generate.js "'+uname+'" "'+uid+'"').toString();

        //For developers to check what the child process is outputting. 
        console.log(result);

        //Creating a Fetch object query to find the document stored by child process
        var fetchObj = User.findOne({
            certi_id: uid,
            holder_name: uname
        });

        //executing the query. If successful, Success code is sent along with png image. 
        fetchObj.exec((err, user)=>{
            if(user === null || err){
                console.error("No such User found");
                res.status(404).send("Error: No such record found");
            }
            else
                res.status(200).contentType(user.img.contentType).send(user.img.data);
        });
    }
})

//Route 3- Fetching a certificate using the certificate id as query parameter in Get method
app.get('/get-certi', (req, res)=>{
    var uid = req.query.certi_id;

    //Validating certificate id passed as query parameter
    let val_result = validateFields({userid: uid});
    if(val_result.error){
        console.log(val_result.error.details);
        res.status(400).send("query parameter is not valid");
    }

    else{
        var fetchObj = User.findOne({
            certi_id: uid,
        });
        fetchObj.exec().then((user)=>{
            if(user === null){
                console.error("No such record found");
                res.status(404).send("Error: No such record found");
            }
            else
                res.status(200).contentType(user.img.contentType).send(user.img.data);
        }).catch((err)=>{
            console.log("err handled");
        });
        
    }
})

//app listener for requests
app.listen(PORT, function(){
    console.log('Listening on port', PORT);
    
    //Connecting to MongoDB
    connectDb().then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.error("ERROR:", err.message.toString());
    });
});

//Validation function used for validation of user inputs
function validateFields(field){
    const JoiUserSchema = Joi.object({
        username: Joi.string().min(2).max(20).optional(),
        userid: Joi.string().min(12).max(12).optional()
    }).options({abortEarly: false});

    return JoiUserSchema.validate(field);
}