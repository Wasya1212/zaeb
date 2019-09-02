const mongoose = require('mongoose');
const validator = require('validator');

const MessageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
