const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String
  },

  googleId: {
    type: String
  },

  appleId: {
    type: String
  },

  verified: {
    type: Boolean,
    default: false
  },

  verificationCode: {
    type: String
  },

  resetPasswordCode: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('User', UserSchema);