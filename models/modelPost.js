const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);


const postSchema = mongoose.Schema({
  id: {
    type: Number
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});


postSchema.pre('save', async function(next) {
  if (this.isNew) {
      try {
          const counter = await Counter.findByIdAndUpdate(
              'postId',
              { $inc: { seq: 1 } },
              { new: true, upsert: true }
          );
          this.id = counter.seq;
          next();
      } catch (error) {
          next(error);
      }
  } else {
      next();
  }
});



const modelPost = mongoose.model('post', postSchema);
module.exports = modelPost;
