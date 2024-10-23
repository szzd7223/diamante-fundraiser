const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://USER_01:ssss@cluster0.v3iwhye.mongodb.net/fundRaiserProject');

const fundraiserSchema = new mongoose.Schema({
    title: String,
    description: String,
    goal: Number,
    publicKey: String,
  });

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

module.exports = {Fundraiser};