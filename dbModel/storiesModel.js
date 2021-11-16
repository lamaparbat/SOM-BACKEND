const mongoose = require("mongoose");

const schema = mongoose.Schema({
 title: String,
 description: String,
 img: Object,
 category: String,
 language: String,
 author: String,
 date: String,
 views: Number,
 likes: Number
});

module.exports = new mongoose.model('stories', schema);
