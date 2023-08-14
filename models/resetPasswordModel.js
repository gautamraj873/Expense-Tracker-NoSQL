const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = ResetPassword;