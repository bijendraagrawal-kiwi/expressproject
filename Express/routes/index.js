var router = express.Router();
const express = require('express');
const bcryptjs = require('bcryptjs');
const connection = require('../src/connection/connection.js');
const schema = require('../src/schema/schema.js');
const schemaDraft = schema.schemaDraft();
const authentication = require('../middleware/middle.js')
const jwt = require("jsonwebtoken")
connection.con();
const mongoose = require('mongoose');
const model = mongoose.model('user',schemaDraft);




router.get('/info',(req,res) => {

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

router.post("/create",(req,res) => {
   

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

router.delete("/delete",(req,res) => {

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
});



router.put("/update",async (req,res) => {

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


  router.get('/view', authentication);

module.exports = router;
