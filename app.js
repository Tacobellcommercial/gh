require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
  res.render("home");
})

app.get("/login", (req, res)=>{
  res.render("login", {message: ""});
})

app.get("/register", (req, res)=>{
  res.render("register", {message: ""});
})

app.post("/register", (req, res)=>{
  User.find({email: req.body.username}, (err, results)=>{
    if (results.length === 0){
      newUser = new User({
        email: req.body.username,
        password: req.body.password
      });

      newUser.save((err)=>{
        if (err){
          console.log(err);
        }else{
          res.redirect("/secrets");
        }
      });

    }else{
      res.render("register", {message: "Username already made! Please choose another one."})
    }
  })

})

app.post("/login", (req, res)=>{
  User.find({email: req.body.username}, (err, results)=>{
    console.log("finding");
    if (err){
      console.log(err);
    }else{
      console.log("no error");
      if (results === 0){
        res.render("login", {message: "Username or password is incorrect, please try again!"})
      }else{

        if (results[0].password === req.body.password){
          res.redirect("/secrets");
        }else{
          res.render("login", {message: "Username or password is incorrect, please try again!"})
        }
      }
    }

  })
})


app.get("/secrets", (req, res)=>{
  res.render("secrets");
})


app.listen(3000, ()=>{
  console.log("Server started on port 3000");
})
