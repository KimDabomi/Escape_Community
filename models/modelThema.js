const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema
const themaSchema = mongoose.Schema({
  region:{
    type:String,
    trim:true,
  },
  store:{
    type:String,
    trim:true,
  },
  thema:{
    type:String,
    trim:true
  },
  star:{
    type:Number,
    trim:true
  },
  level:{
    type:String,
    trim:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  updatedAt:{
    type:Date
  }
},{
  toObject:{virtuals:true}
});


// model & export
const modelThema = mongoose.model('thema',themaSchema);
module.exports = modelThema;

