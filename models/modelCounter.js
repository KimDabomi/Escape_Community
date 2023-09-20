const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const modelCounter = mongoose.model('Counter', counterSchema);
module.exports = modelCounter;