const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema({
  callNumber: Number,
  type: String,
  location: String,
  postal: String,
  details: String,
  primaryOfficer: String,
}, { timestamps: true });

module.exports = mongoose.model("Call", CallSchema);
