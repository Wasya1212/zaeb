const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: false
  },
  private: {
    type: Boolean,
    required: true,
    default: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId
  }]
}, { timestamps: true });

ChatSchema.methods.comparePassword = bcrypt.compareSync;

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
