const mongoose = require("mongoose");

//defining collection schema
const schema = mongoose.Schema({
 uname: String,
 email: String,
 password: String,
 type: String,
 token:String,
 date: String
})

//creating || accessing collection
const UserModel = new mongoose.model('users', schema);

module.exports = UserModel;