const mongoose = require("mongoose");

const penalCodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fine: { type: Number, required: true },
  jailTime: { type: Number, required: true }
});

module.exports = mongoose.model("PenalCode", penalCodeSchema);
