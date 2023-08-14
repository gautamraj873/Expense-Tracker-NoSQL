const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    default: false,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;