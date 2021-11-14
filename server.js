const express = require("express");
const cors = require("cors");
require("dotenv").config()
const mongoose = require("mongoose"); 
const UserModel = require("./dbModel/UserModel.js");
const bcrypt = require("bcryptjs");

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
 
 // insert into db
 UserModel.create({
  uname: data.uname,
  email: data.email,
  password: hashPassword,
  type:data.type
 }, (err, doc) => {
  if (err) {
   res.status(500).send(err);
  } else {
   res.status(200).send({
    message: "Registered successfull !!",
    data: doc
   })
  }
 })
 
 console.log("registered successfull !!");
})

//port listener
server.listen(port, () => {
 console.log(`Listening to the port ${port}`);
})