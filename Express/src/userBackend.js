const express = require('express');
const bodyParser = require('body-parser')
const bcryptjs = require('bcryptjs');
const connection = require('./connection/connection.js');
const schema = require('./schema/schema.js');
const post = require('./schema/postSchema.js');
const postSchema = post.post();
const schemaDraft = schema.schemaDraft();
const authentication = require('../middleware/middle.js')
const app = express();
const jwt = require("jsonwebtoken")
connection.con();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
const mongoose = require('mongoose');
const model = mongoose.model('user',schemaDraft);
const user_post = mongoose.model('post',postSchema);


app.get('/info',(req,res) => {

    model.findOne(({email : req.body.email}), async (err,val) =>{
  
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            if(val == null)
            {
                console.log("Here is no data for your login");
                res.send("Here is no data for your login");
            }
            else
            {
                const password = req.body.password;
                const databasePassword = val.password;

                const bool = await bcryptjs.compare(password,databasePassword);
                if(bool){
                    const token = jwt.sign({ email : req.body.email},"Bijendra");
                    console.log(val);
                    res.send(token);
                }
                else{
                    res.send("Password does not match");
                    console.log("password does not match");
                }

                }  
        }
    });
});

app.post("/create",(req,res) => {
   

    if(req.body.password != req.body.confirm_password)
    {
        console.log("Please enter same password on both field");
        res.send("Please enter same password on both field");   
    }
    else
    {
    model.findOne(({email : req.body.email}), async (err,val) => {
       
        if(err){
            console.log(err);
            res.send(err);
        }
        else
        {
            if(val != null)
            {
                console.log("User from " + req.body.email + " is already exist ");
                res.send("User from " + req.body.email + " is already exist ");
            }
            else
            {
                const salt = await bcryptjs.genSalt(10);
                const securePassword = await bcryptjs.hash(req.body.password,salt);

                const doc = new model({

                    first_name : req.body.first_name,
                    last_name : req.body.last_name,
                    email : req.body.email,
                    password : securePassword,
                    contact_number : req.body.contact_number,
                    address : req.body.address
                });

                const obj = await doc.save();
                console.log("User has been saved");
                res.send(obj);
            }
        }
    });
}
});

app.delete("/delete",(req,res) => {

    model.deleteOne(({email : req.body.email}),(err,val) => {

        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            if(val.deletedCount == 0)
            {
                console.log("There is nothing for delete , Please enter other email for deletion");
                res.send("There is nothing for delete , Please enter other email for deletion");
            }
            else
            {
            console.log("Data has been deleted");
            res.send("Data has been deleted");
            }
        }
    });
});

app.put("/update",async (req,res) => {

    model.updateOne({email : req.body.email} , { $set : {first_name : req.body.first_name, last_name : req.body.last_name , address : req.body.address ,contact_number : req.body.contact_number }}).then((value) => {
        try {
            console.log(value);
            res.send(value);
        }
        catch(err){
            console.log(err);
            res.send(err);
        }
    });
    });


    app.get('/view', authentication,(req,res) => {

        console.log("This is your view page");
        res.send("This is your view page");

    });

    app.post('/createPost',authentication,async (req,res) => {


        const p =  new user_post({

            user_Id : req.body.user_Id,
            title : req.body.title,
            description : req.body.description
        });

        const obj = await p.save();
        console.log(obj);
        res.send(obj);
    })

    app.get('/allPost', async (req,res) => {

        const posts = await user_post.find();
        console.log(posts);
        res.send(posts);
    });

    app.get('/userPost',authentication,(req,res) => {

         user_post.find().populate("user_Id").then((value) => {

            console.log(value);
            res.send(value);
         });
    })
    
app.listen(8080);
