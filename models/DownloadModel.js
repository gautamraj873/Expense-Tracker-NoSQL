const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  fileUrl: {
    type: String,
    required: true,
  }
});

const Download = mongoose.model("Download", downloadSchema);

module.exports = Download;
