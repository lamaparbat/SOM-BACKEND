const express = require("express");
const cors = require("cors");
require("dotenv").config()
const mongoose = require("mongoose"); 
const UserModel = require("./dbModel/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtGenerator = require("./jwt.js");
const Pusher = require("pusher");
const e = require("express");

//server config
const server = express()
const port = process.env.PORT || 5000;

//db config
const conUrl = `mongodb+srv://parbat:${process.env.PASSWORD}@cluster0.gymid.mongodb.net/som?retryWrites=true&w=majority`;
mongoose.connect(conUrl, {
 useNewUrlParser: true,
 useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
 console.log("Db connection successfull !!")
})

//pusher -- socket config
const pusher = new Pusher({
 appId: "1297075",
 key: "079f21a2e193a4635116",
 secret: "6b2bd1dec8b7fc81955d",
 cluster: "ap2",
 useTLS: true
});

//middlerware
server.use(cors())
server.use(express.json())

//https routing
server.get("/", (req, res) => {
 res.send("hellow world");
})

server.post("/createAccount", async (req, res) => {
 const data = req.body;
 
 //hashing password
 const round = 10;
 const hashPassword = await bcrypt.hash(data.password, round);
 
 //generate web tokens
 const token = await jwtGenerator({ uname: data.uname }, process.env.SECRET_KEY)

 // insert into db
 UserModel.create({
  uname: data.uname,
  email: data.email,
  password: hashPassword,
  type: data.type,
  token: token,
  date: new Date().toLocaleDateString()
 }, (err, doc) => {
  if (err) {
   res.status(500).send(err);
  } else {
   //realtime jwt send to client
   pusher.trigger("jwt", "created", {
    message: token
   });
   res.status(200).send({
    message: "Registered successfull !!",
    data: doc
   })
  }
 })
 console.log("registered successfull !!");
})

//login
server.post("/login", (req, res) => {
 UserModel.find({ email: req.body.email }, async(err, doc) => {
  if (err) {
   console.log(err);
  } else {
   const check = await bcrypt.compare(req.body.password, doc[0].password);
   if (check) {
    res.status(200).send({
     token: doc[0].token,
     check: true,
     message: "login successfull"
    });
    console.log("login successfull !!")
   } else {
    res.send({
     check: false,
     message: "login failed !!"
    });
   }
  }
 })
})

//port listener
server.listen(port, () => {
 console.log(`Listening to the port ${port}`);
})